import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {BalanceService} from '../../../balance.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MockDataService} from '../../../../services/mock-data.service';
import {CurrencyBalanceModel} from '../../../../model/currency-balance.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';

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
  public activeFiat = {
    id: 1,
    name: 'USD',
    description: 'USD',
  };

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    // if ($event.target.className !== 'select__value select__value--active') {
    //   this.openCurrencyDropdown = false;
    // }
    if ($event.target.className !== 'select__value select__value--active' && $event.target.className !== 'select__search-input') {
      this.openPaymentSystemDropdown = false;
      this.openCurrencyDropdown = false;
    }
  }

  constructor(
    public balanceService: BalanceService,
    public mockData: MockDataService,
  ) { }

  ngOnInit() {
    /**-------mock data------**/
    this.defaultFiatNames = this.mockData.getFiatNames();
    this.fiatNames = this.defaultFiatNames;
    this.fiatDataByName = this.mockData.getCryptoData();
    this.merchants = this.fiatDataByName.merchantCurrencyData;
    this.selectedMerchant = this.fiatDataByName.merchantCurrencyData[0];
    /** --------------------------*/
    this.initForm();
    this.balanceService.getFiatNames()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
      this.defaultFiatNames = res;
      this.fiatNames = this.defaultFiatNames;
      this.activeFiat = this.fiatNames[0];
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
    this.balanceService.getCurrencyData(currency.name)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.fiatDataByName = res;
        this.merchants = this.fiatDataByName.merchantCurrencyData;
        this.selectedMerchant = this.merchants[0];
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
    if (this.form.valid) {
      this.amount = this.form.controls['amount'].value
      const data = {
        operationType: this.fiatDataByName.payment.operationType,
        currency: this.fiatDataByName.currency.id,
        merchant: this.selectedMerchant.merchantId,
        sum: this.amount
      };
      this.balanceService.refill(data).subscribe(res => {
        console.log(res);
      });
      this.submitSuccess = true;
      console.log(data);
    }
  }

  searchMerchant(e) {
    this.merchants = this.fiatDataByName.merchantCurrencyData.filter(f => f.name.toUpperCase().match(e.target.value.toUpperCase()));
  }

  private minCheck(amount: FormControl) {
      if (this.fiatDataByName.minRefillSum > amount.value) {
        return {'minThen': true};
      }
      return null;
  }
}
