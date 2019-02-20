import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {CurrencyBalanceModel} from 'app/model';
import {Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BalanceService} from '../../../../services/balance.service';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {keys} from '../../../../../shared/constants';
import {getFiatCurrenciesForChoose, State} from 'app/core/reducers';
import {select, Store} from '@ngrx/store';
import {SEND_FIAT} from '../../send-money-constants';
import {CommissionData} from '../../../../models/commission-data.model';
import {defaultCommissionData} from '../../../../store/reducers/default-values';
import {environment} from '../../../../../../environments/environment';
import {PopupService} from 'app/shared/services/popup.service';

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
  public isAmountMax;
  public isAmountMin;
  public form: FormGroup;
  public calculateData: CommissionData = defaultCommissionData;

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

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.className !== 'select__value select__value--active' && $event.target.className !== 'select__search-input') {
      this.openCurrencyDropdown = false;
      this.openPaymentSystemDropdown = false;
    }
  }

  constructor(
    public balanceService: BalanceService,
    public popupService: PopupService,
    private store: Store<State>,
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.form.controls['amount'].valueChanges
      .pipe(debounceTime(1000))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res !== '0') {
          this.calculateCommission(res);
        }
      });

    this.store
      .pipe(select(getFiatCurrenciesForChoose))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currencies => {
        this.fiatNames = currencies;
        this.activeFiat = this.fiatNames[0];
        this.getFiatInfoByName(this.activeFiat.name);
        this.getBalance(this.activeFiat.name);
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
    this.getBalance(this.activeFiat.name);
  }

  selectMerchant(merchant) {
    this.form.reset();
    if (merchant !== {}) {
      this.selectedMerchant = merchant;
      this.minWithdrawSum = merchant.minSum || 0;
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

    if (environment.production) {
      // todo while insecure
      this.popupService.demoPopupMessage = 0;
      this.popupService.showDemoTradingPopup(true);
      this.balanceService.closeSendMoneyPopup$.next(false);
    } else {
      if (this.form.valid && !this.isAmountMin && this.form.controls['amount'].value !== '0' && !this.isAmountMax && this.selectedMerchant.name) {
        this.isSubmited = false;
        this.isEnterData = false;
      }
    }
  }

  getBalance(name: string) {
    this.balanceService.getTotalBalance()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        const allBalances = res as { sumTotalUSD: any, mapWallets: any };
        const needBalance = allBalances.mapWallets.filter(item => item.currencyName === name);
        this.activeBalance = needBalance[0].activeBalance;
      });
  }

  private getFiatInfoByName(name: string) {
    this.calculateData = defaultCommissionData;
    this.balanceService.getCurrencyData(name)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.fiatInfoByName = res;
        this.merchants = this.fiatInfoByName.merchantCurrencyData;
        this.selectMerchant(this.merchants.length ? this.merchants[0] : {});
      });
  }


  calculateCommission(amount) {
    if (this.selectedMerchant.merchantId) {
      this.balanceService
        .getCommissionToWithdraw(amount, this.activeFiat.id, this.fiatInfoByName.merchantCurrencyData[0].merchantId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.calculateData = res as CommissionData;
        });
    }
  }

  amountInput(event) {
    this.amountValidator(event.target.value);
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
        operation: SEND_FIAT,
        data: this.model
      };

      this.balanceService.goToPinCode$.next(data);
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
      address: new FormControl('', [Validators.required]),
      amount: new FormControl('0', [Validators.required]),
    });
  }

  amountValidator(sum) {
    this.isAmountMax = +sum > +this.activeBalance ? true : false;
    this.isAmountMin = +sum < +this.minWithdrawSum ? true : false;
  }

}
