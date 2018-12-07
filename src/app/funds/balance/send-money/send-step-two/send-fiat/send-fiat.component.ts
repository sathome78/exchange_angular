import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {CurrencyBalanceModel} from '../../../../../model';
import {Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BalanceService} from '../../../../../shared/services/balance.service';
import {takeUntil} from 'rxjs/operators';
import {MockDataService} from '../../../../../shared/services/mock-data.service';
import {keys} from '../../../../../core/keys';

@Component({
  selector: 'app-send-fiat',
  templateUrl: './send-fiat.component.html',
  styleUrls: ['./send-fiat.component.scss']
})
export class SendFiatComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public fiatNames: CurrencyBalanceModel[] = [];
  public recaptchaKey = keys.recaptchaKey;
  public openCurrencyDropdown = false;
  public openPaymentSystemDropdown = false;
  public fiatInfoByName;
  public minWithdrawSum = 0;
  public merchants;
  public isEnterData = true;
  public activeBalance = 0;
  public isSubmited = false;
  public selectedMerchant;
  public activeFiat;
  public form: FormGroup;

  public model = {
    currency: 0,
    merchant: 0,
    sum: '',
    destination: '',
    destinationTag: '',
    merchantImage: '',
    operationType: '',
    recipientBankName: '',
    recipientBankCode: '',
    userFullName: '',
    remark: '',
    walletNumber: '',
    securityCode: ''
  };

  public calculateData = {
    amount: 0,
    percentExchange: 0,
    fixedMinCommissiom: 0,
    exchangeSum: 0,
    percentMerchant: 0,
    merchantSum: 0,
    totalCommission: 0,
    totalCommissionSum: 0,
    amountWithCommission: 0,
  };

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.className !== 'select__value select__value--active' && $event.target.className !== 'select__search-input') {
      this.openCurrencyDropdown = false;
      this.openPaymentSystemDropdown = false;
    }
  }

  constructor(
    public balanceService: BalanceService,
    public mockDataService: MockDataService,
  ) { }

  ngOnInit() {
    this.initForm();
    // /**-------mock data------**/
    // this.fiatNames = this.mockDataService.getFiatNames();
    // this.fiatInfoByName = this.mockDataService.getCryptoData();
    // this.activeFiat = this.fiatNames[0];
    // /**----------------------**/
    this.balanceService.getFiatNames()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.fiatNames = res;
        this.activeFiat = this.fiatNames[0];
        this.getFiatInfoByName(this.activeFiat.name);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  selectCurrency(currency) {
    this.form.reset();
    this.activeFiat = currency;
    this.currencyDropdownToggle();
    this.getFiatInfoByName(this.activeFiat.name);
  }

  selectMerchant(merchant) {
    this.form.reset();
    if (merchant !== {}) {
      this.selectedMerchant = merchant;
      this.minWithdrawSum = merchant.minSum;
      this.calculateData.percentMerchant = this.fiatInfoByName.merchantCurrencyData[0] ? this.fiatInfoByName.merchantCurrencyData[0].outputCommission : 0;
      this.calculateData.fixedMinCommissiom = this.fiatInfoByName.merchantCurrencyData[0] ? this.fiatInfoByName.merchantCurrencyData[0].fixedMinCommission : 0;
      this.calculateData.totalCommission = this.calculateData.percentMerchant + this.calculateData.percentExchange;
    }
  }

  currencyDropdownToggle() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.openPaymentSystemDropdown = false;
  }

  balanceClick() {
    if (this.activeBalance > this.minWithdrawSum) {
      this.form.controls['amount'].setValue(this.activeBalance.toString());
      this.calculateCommission(this.activeBalance);
    }
  }

  togglePaymentSystemDropdown() {
    this.openPaymentSystemDropdown = !this.openPaymentSystemDropdown;
    this.openCurrencyDropdown = false;
  }

 onSubmitWithdrawal() {
    this.isSubmited = true;
    if (this.form.valid && this.selectedMerchant.name) {
      this.isSubmited = false;
      this.isEnterData = false;
      console.log(this.form);
      console.log(this.selectedMerchant);
    }
 }

  private getFiatInfoByName(name: string) {
    this.balanceService.getCurrencyData(name)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.fiatInfoByName = res;
        this.merchants = this.fiatInfoByName.merchantCurrencyData;
        this.selectMerchant(this.merchants.length ? this.merchants[0] : {});
        this.activeBalance = this.fiatInfoByName.activeBalance || 0;
        console.log(res);
      });
  }


  calculateCommission(amount) {
    this.calculateData.amount = amount;
    this.calculateData.merchantSum = amount * ( this.calculateData.percentMerchant / 100);
    this.calculateData.totalCommissionSum = this.calculateData.merchantSum + this.calculateData.exchangeSum;
    this.calculateData.amountWithCommission = amount - this.calculateData.totalCommissionSum;
  }

  amountInput(event) {
    this.calculateCommission(event.target.value);
  }

  afterResolvedCaptcha(event) {
    if (this.selectedMerchant.name) {
      this.model.currency = this.selectedMerchant.currencyId;
      this.model.merchant = this.selectedMerchant.merchantId;
      this.model.recipientBankName = this.selectedMerchant.description;
      this.model.merchantImage = this.selectedMerchant.listMerchantImage[0].image_path;
      this.model.sum = this.form.controls['amount'].value;
      this.model.walletNumber = this.form.controls['address'].value;

      const data = {
        operation: 'Send Fiat',
        data: this.model
      }

      /** mock */
      // console.log(data)
      this.balanceService.goToPinCode$.next(data);
      /** ----------- **/
      this.balanceService.sendPinCode().subscribe(res => {
        this.balanceService.goToPinCode$.next(data);
      });
    }
  }

  searchMerchant(e) {
    this.merchants = this.fiatInfoByName.merchantCurrencyData.filter(f => f.name.toUpperCase().match(e.target.value.toUpperCase()));
  }

  goToWithdrawal() {
    this.isEnterData = true;
  }

  private initForm() {
    this.form = new FormGroup({
      address: new FormControl('', [Validators.required] ),
      amount: new FormControl('', [Validators.required, this.minCheck.bind(this), this.maxCheck.bind(this)]),
    });
  }

  private minCheck(amount: FormControl) {
    if (this.minWithdrawSum > amount.value) {
      return {'minThen': true};
    }
    return null;
  }

  private maxCheck(amount: FormControl) {
    if (this.activeBalance < amount.value) {
      return {'maxThen': true};
    }
    return null;
  }

}
