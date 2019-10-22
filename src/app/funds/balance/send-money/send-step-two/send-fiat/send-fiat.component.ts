import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { CurrencyBalanceModel } from 'app/model';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BalanceService } from '../../../../services/balance.service';
import { takeUntil } from 'rxjs/operators';
import { keys } from '../../../../../shared/constants';
import { getFiatCurrenciesForChoose, getUserInfo, State } from 'app/core/reducers';
import { select, Store } from '@ngrx/store';
import { SEND_FIAT } from '../../send-money-constants';
import { PopupService } from 'app/shared/services/popup.service';
import { UtilsService } from 'app/shared/services/utils.service';
import { FUG } from 'app/funds/balance/balance-constants';
import { BalanceItem } from 'app/funds/models/balance-item.model';

@Component({
  selector: 'app-send-fiat',
  templateUrl: './send-fiat.component.html',
  styleUrls: ['./send-fiat.component.scss'],
})
export class SendFiatComponent implements OnInit, OnDestroy {
  @Input() balanceData;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public fiatNames: CurrencyBalanceModel[] = [];
  public recaptchaKey = keys.recaptchaKey;
  public openCurrencyDropdown = false;
  public openPaymentSystemDropdown = false;
  public fiatInfoByName;
  public minWithdrawSum = 0;
  public merchants;
  public amountValue = 0;
  public activeBalance = 0;
  public isSubmited = false;
  public selectedMerchant;
  public activeFiat;
  public dailyLimit;
  public form: FormGroup;
  public searchTemplate = '';
  public selectMerchantName;
  public selectedMerchantNested;
  public userInfo: ParsedToken;
  public FUG = FUG;
  public isQuberaBalances = false;
  public isQuberaKYCSuccess = false;

  public viewsList = {
    LOADING: 'loading',
    CAPTCHA: 'captcha',
    MAIN: 'main',
    DENIED: 'denied',
  };

  public VIEW = this.viewsList.LOADING;

  public model = {
    currency: 0,
    merchant: 0,
    sum: '',
    currencyName: '',
    destination: '',
    destinationTag: '',
    merchantImage: '',
    securityCode: '',
  };

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if (
      $event.target.className !== 'select__value select__value--active' &&
      $event.target.className !== 'select__search-input'
    ) {
      this.openCurrencyDropdown = false;
      this.openPaymentSystemDropdown = false;
    }
  }

  constructor(
    public balanceService: BalanceService,
    public popupService: PopupService,
    public utilsService: UtilsService,
    private store: Store<State>
  ) {}

  ngOnInit() {
    this.initForm();

    this.store
      .pipe(select(getFiatCurrenciesForChoose))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currencies => {
        this.fiatNames = currencies;
        this.activeFiat = this.fiatNames[0];
        this.setActiveFiat();
        if (this.activeFiat) {
          this.getFiatInfoByName(this.activeFiat.name);
          this.getBalance(this.activeFiat.id);
        }
      });
    if (this.selectMerchantName === FUG) {
      this.form.removeControl('address');
    }

    this.store
      .pipe(select(getUserInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userInfo: ParsedToken) => {
        this.userInfo = userInfo;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setActiveFiat() {
    let currency;
    if (this.balanceData && this.balanceData.currencyId) {
      currency = this.fiatNames.filter(item => +item.id === +this.balanceData.currencyId);
    }
    this.activeFiat = currency && currency.length ? currency[0] : this.fiatNames[0];
  }

  selectCurrency(currency) {
    this.form.reset();
    this.activeFiat = currency;
    this.currencyDropdownToggle();
    this.getFiatInfoByName(this.activeFiat.name);
    this.getBalance(this.activeFiat.id);
  }

  selectMerchant(merchant, merchantImage = null) {
    this.selectedMerchantNested = merchantImage;
    this.selectMerchantName = merchantImage.image_name || merchant.name;
    this.selectedMerchant = merchant;
    this.setMinWithdrawSum();
    if (merchant.name === FUG) {
      this.form.removeControl('address');
    } else {
      this.form.addControl('address', new FormControl('', [Validators.required]));
    }
  }

  currencyDropdownToggle() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.openPaymentSystemDropdown = false;
  }

  balanceClick() {
    if (+this.activeBalance > +this.minWithdrawSum) {
      this.formAmount.setValue(this.activeBalance.toString());
      this.amountValue = this.activeBalance;
      this.formAmount.updateValueAndValidity();
      this.formAmount.markAsTouched();
    }
  }
  dailyLimitClick() {
    if (+this.activeBalance > +this.minWithdrawSum) {
      let amount = this.activeBalance;
      if (+this.activeBalance > +this.dailyLimit) {
        amount = this.dailyLimit;
      }
      this.formAmount.setValue(amount.toString());
      this.amountValue = amount;
      this.formAmount.updateValueAndValidity();
      this.formAmount.markAsTouched();
    }
  }

  togglePaymentSystemDropdown() {
    this.openPaymentSystemDropdown = !this.openPaymentSystemDropdown;
    // FUG BLOCK
    this.merchants =
      this.fiatInfoByName && this.fiatInfoByName.merchantCurrencyData
        ? this.fiatInfoByName.merchantCurrencyData.filter(i => this.utilsService.filterMerchants(i))
        : [];
    this.searchTemplate = '';
    this.openCurrencyDropdown = false;
  }

  onSubmitWithdrawal() {
    this.isSubmited = true;
    this.formAmount.updateValueAndValidity();
    if (this.form.valid && this.selectedMerchant.name) {
      this.isSubmited = false;
      this.VIEW = this.viewsList.CAPTCHA;
    }
  }

  getBalance(id: string) {
    this.balanceService
      .getBalanceByName(id, 'FIAT')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: BalanceItem) => {
        this.activeBalance = res.activeBalance;
      });
  }

  private getFiatInfoByName(name: string) {
    this.balanceService
      .getCurrencyData(name)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.fiatInfoByName = res;
        this.dailyLimit = res.leftDailyWithdrawAmount;
        // FUG BLOCK
        this.merchants = this.fiatInfoByName.merchantCurrencyData.filter(i => this.utilsService.filterMerchants(i));

        this.selectedMerchant = this.merchants.length ? this.merchants[0] : null;
        this.selectedMerchantNested = this.selectedMerchant ? this.selectedMerchant.listMerchantImage[0] : null;
        this.selectMerchantName = this.selectedMerchantNested ? this.selectedMerchantNested.image_name : '';
        if (this.selectedMerchant) {
          this.setMinWithdrawSum();
        }
        if (this.selectMerchantName === FUG) {
          this.form.removeControl('address');
        }
        if (this.activeFiat && this.fiatInfoByName) {
          this.VIEW = this.viewsList.MAIN;
        }
      }, err => {
        if (err.error && err.error.title === 'USER_OPERATION_DENIED') {
          this.VIEW = this.viewsList.DENIED;
        }
      });
  }

  private setMinWithdrawSum() {
    this.minWithdrawSum =
      this.fiatInfoByName.minWithdrawSum > parseFloat(this.selectedMerchant.minSum)
        ? this.fiatInfoByName.minWithdrawSum
        : parseFloat(this.selectedMerchant.minSum);
    this.formAmount.updateValueAndValidity();
  }

  amountInput(event) {
    this.amountValue = event.target.value;
  }

  afterResolvedCaptcha(event) {
    if (this.selectedMerchant.name) {
      this.model.currency = this.selectedMerchant.currencyId;
      this.model.merchant = this.selectedMerchant.merchantId;
      this.model.merchantImage = this.selectedMerchantNested.id;
      this.model.currencyName = this.activeFiat.name || '';
      this.model.sum = this.formAmount.value;
      if (this.selectedMerchant.name !== FUG) {
        this.model.destination = this.formAddress.value;
      }

      const data = {
        operation: SEND_FIAT,
        data: this.model,
      };

      this.balanceService.goToPinCode$.next(data);
    }
  }

  searchMerchant(e) {
    this.searchTemplate = e.target.value;
    // FUG BLOCK
    this.merchants = this.fiatInfoByName.merchantCurrencyData
      .filter(i => this.utilsService.filterMerchants(i))
      .filter(
        merchant =>
          !!merchant.listMerchantImage.filter(f2 => f2.image_name.toUpperCase().match(e.target.value.toUpperCase()))
            .length
      );
  }

  goToWithdrawal() {
    this.VIEW = this.viewsList.MAIN;
  }

  private initForm() {
    this.form = new FormGroup({
      address: new FormControl('', [Validators.required]),
      amount: new FormControl('', [
        Validators.required,
        this.isMaxThenActiveBalance.bind(this),
        this.isMaxThenDailyLimit.bind(this),
        this.isMinThenMinWithdraw.bind(this),
      ]),
    });
  }

  isMaxThenActiveBalance(): { [key: string]: any } | null {
    if (+this.activeBalance < +this.amountValue) {
      return { isMaxThenActiveBalance: true };
    }
    return null;
  }

  isMaxThenDailyLimit(): { [key: string]: any } | null {
    if (+this.dailyLimit < +this.amountValue) {
      return { isMaxThenDailyLimit: true };
    }
    return null;
  }

  isMinThenMinWithdraw(): { [key: string]: any } | null {
    if (+this.minWithdrawSum > +this.amountValue) {
      return { isMinThenMinWithdraw: true };
    }
    return null;
  }

  get currName() {
    return this.activeFiat ? this.activeFiat.name : '';
  }
  get formAmount() {
    return this.form.controls['amount'];
  }
  get formAddress() {
    return this.form.controls['address'];
  }
  get isDisabledForm() {
    return this.formAmount.invalid || this.formAddress.invalid || !this.searchMerchant || !this.activeFiat;
  }
  get isNeedKyc(): boolean {
    return this.selectedMerchant && this.selectedMerchant.needKycWithdraw;
  }

  trackByFiatNames(index, item) {
    return item.id;
  }

  trackByIndex(index, item) {
    return index;
  }
}
