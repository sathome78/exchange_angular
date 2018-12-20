import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MockDataService} from '../../../../../shared/services/mock-data.service';
import {CurrencyBalanceModel} from '../../../../../model/currency-balance.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BalanceService} from '../../../../services/balance.service';
import {select, Store} from '@ngrx/store';
import {getCryptoCurrenciesForChoose, getFiatCurrenciesForChoose, State} from 'app/core/reducers';
import {environment} from '../../../../../../environments/environment';
import {PopupService} from '../../../../../shared/services/popup.service';

@Component({
  selector: 'app-refill-fiat',
  templateUrl: './refill-fiat.component.html',
  styleUrls: ['./refill-fiat.component.scss']
})
export class RefillFiatComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public form: FormGroup;
  public submitSuccess = false;
  public isSubmited = false;
  public fiatNames: CurrencyBalanceModel[] = [];
  public defaultFiatNames: CurrencyBalanceModel[] = [];
  public fiatDataByName;
  public selectedMerchant;
  public amount;
  public merchants;
  public openCurrencyDropdown = false;
  public openPaymentSystemDropdown = false;
  public refillData;
  public activeFiat;

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.className !== 'select__value select__value--active' && $event.target.className !== 'select__search-input') {
      this.openPaymentSystemDropdown = false;
      this.openCurrencyDropdown = false;
    }
  }

  constructor(
    public balanceService: BalanceService,
    public popupService: PopupService,
    private store: Store<State>,
  ) { }

  ngOnInit() {
    this.initForm();

    this.store
      .pipe(select(getFiatCurrenciesForChoose))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currencies => {
        this.defaultFiatNames = currencies;
        this.fiatNames = this.defaultFiatNames;
        this.activeFiat = this.fiatNames[0];
        this.getDataByCurrency(this.activeFiat.name);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  toggleCurrencyDropdown() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.openPaymentSystemDropdown = false;
  }

  togglePaymentSystemDropdown() {
    this.openPaymentSystemDropdown = !this.openPaymentSystemDropdown;
    this.openCurrencyDropdown = false;
  }

  selectCurrency(currency) {
    this.activeFiat = currency;
    this.toggleCurrencyDropdown();
    this.getDataByCurrency(currency.name);
  }

  private getDataByCurrency(currencyName) {
    this.balanceService.getCurrencyData(currencyName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.fiatDataByName = res;
        this.merchants = this.fiatDataByName.merchantCurrencyData;
        this.selectedMerchant = this.merchants.length ? this.merchants[0] : {};
        console.log(res);
      });
  }

  selectMerchant(merchant) {
    this.selectedMerchant = merchant;
    this.togglePaymentSystemDropdown();
  }

  initForm() {
    this.form = new FormGroup({
      amount: new FormControl('', [Validators.required, this.minCheck.bind(this)] ),
    });
  }

  amountInput(e) {}

  submitRefill() {
    this.isSubmited = true;
    if (environment.production) {
      // todo while insecure
      this.popupService.demoPopupMessage = 0;
      this.popupService.showDemoTradingPopup(true);
      this.balanceService.closeRefillMoneyPopup$.next(false);
    } else {
      if (this.form.valid && this.selectedMerchant.name) {
        this.isSubmited = false;
        this.amount = this.form.controls['amount'].value
        const data = {
          operationType: this.fiatDataByName.payment.operationType,
          currency: this.fiatDataByName.currency.id,
          merchant: this.selectedMerchant.merchantId,
          sum: this.amount
        };
        this.balanceService.refill(data).subscribe(res => {
          this.refillData = res;
          this.submitSuccess = true;
        });
      }
    }

  }

  searchMerchant(e) {
    this.merchants = this.fiatDataByName.merchantCurrencyData.filter(f => f.name.toUpperCase().match(e.target.value.toUpperCase()));
  }

  private minCheck(amount: FormControl) {
      if (this.fiatDataByName && this.fiatDataByName.minRefillSum > amount.value) {
        return {'minThen': true};
      }
      return null;
  }
}

