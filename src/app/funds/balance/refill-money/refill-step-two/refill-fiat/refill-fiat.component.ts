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
import {BalanceItem} from 'app/funds/models/balance-item.model';
import * as _uniq from 'lodash/uniq';
import {RefillResponse} from '../../../../../model/refill-response';

@Component({
  selector: 'app-refill-fiat',
  templateUrl: './refill-fiat.component.html',
  styleUrls: ['./refill-fiat.component.scss']
})
export class RefillFiatComponent implements OnInit, OnDestroy {

  @Input() refillData: any;
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
  public activeFiat;
  public alphabet;
  public redirectionUrl;

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.className !== 'select__value select__value--active'
        && $event.target.className !== 'select__value select__value--active select__value--error'
        && $event.target.className !== 'select__search-input') {
      this.openPaymentSystemDropdown = false;
      this.openCurrencyDropdown = false;
    }
  }

  constructor(
    public balanceService: BalanceService,
    public popupService: PopupService,
    private store: Store<State>,
  ) {}



  ngOnInit() {
    this.initForm();
    this.store
      .pipe(select(getFiatCurrenciesForChoose))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currencies => {
        this.defaultFiatNames = currencies;
        this.fiatNames = this.defaultFiatNames;
        this.setActiveFiat();
        this.getDataByCurrency(this.activeFiat.name);
        this.prepareAlphabet();
      });
  }

  setActiveFiat() {
    let currency;
    if (this.refillData && this.refillData.currencyId) {
      currency = this.fiatNames.filter(item => +item.id === +this.refillData.currencyId);
    }
    this.activeFiat = (currency && currency.length) ? currency[0] : this.fiatNames[0];
  }

  prepareAlphabet() {
    const temp = [];
    this.fiatNames.forEach(currency => {
      const letter = currency.name.toUpperCase()[0];
      temp.push(letter);
    });
    const unique = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    this.alphabet = _uniq(temp.filter(unique).sort());
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  toggleCurrencyDropdown() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.openPaymentSystemDropdown = false;
    this.prepareAlphabet();
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
        this.selectedMerchant = this.merchants.length ? this.merchants[0] : null;
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
    // if (environment.production) {
    //   // todo while insecure
    //   this.popupService.demoPopupMessage = 0;
    //   this.popupService.showDemoTradingPopup(true);
    //   this.balanceService.closeRefillMoneyPopup$.next(false);
    // } else {
      if (this.form.valid && this.selectedMerchant.name) {
        this.isSubmited = false;
        this.amount = this.form.controls['amount'].value;
        const data = {
          operationType: this.fiatDataByName.payment.operationType,
          currency: this.fiatDataByName.currency.id,
          merchant: this.selectedMerchant.merchantId,
          generateNewAddress: true,
          sum: this.amount
        };
        this.balanceService.refill(data)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((res: RefillResponse) => {
            this.refillData = res;
            this.redirectionUrl = this.getRefillRedirectionUrl(res);
            this.submitSuccess = true;
          });
      }
    // }
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

  getRefillRedirectionUrl(response: RefillResponse): string {
    if (response && response.method === 'POST') {
      let url = response.redirectionUrl + '?';
      for (const key in response.params) {
        // console.log('K: ' + key + ' V: ' + response.params[key]);
        url += key + '=' + response.params[key] + '&';
      }
      console.log(url);
      return url;
    }
    if (response && !response.method) {
      return response.redirectionUrl;
    }
    return null;
  }
}

