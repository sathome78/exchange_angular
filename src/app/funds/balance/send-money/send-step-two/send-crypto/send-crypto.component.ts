import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import * as _uniq from 'lodash/uniq';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CurrencyBalanceModel } from '../../../../../model/index';
import { BalanceService } from '../../../../services/balance.service';
import { keys } from '../../../../../shared/constants';
import { select, Store } from '@ngrx/store';
import { getCryptoCurrenciesForChoose, getUserInfo, State } from 'app/core/reducers';
import { SEND_CRYPTO } from '../../send-money-constants';
import { PopupService } from 'app/shared/services/popup.service';
import { BalanceItem } from '../../../../models/balance-item.model';
import { UtilsService } from 'app/shared/services/utils.service';

@Component({
  selector: 'app-send-crypto',
  templateUrl: './send-crypto.component.html',
  styleUrls: ['./send-crypto.component.scss'],
})
export class SendCryptoComponent implements OnInit, OnDestroy {
  @Input() balanceData: BalanceItem;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public recaptchaKey = keys.recaptchaKey;
  public cryptoNames: CurrencyBalanceModel[] = [];
  public cryptoInfoByName;
  public activeBalance = 0;
  public minWithdrawSum = 0;
  public isSubmited = false;

  public isMemo;
  public memoName = '';
  public activeCrypto;
  public dailyLimit;
  public form: FormGroup;
  public loadingBalance = false;
  public userInfo: ParsedToken;

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
    destination: '',
    destinationTag: '',
    currencyName: '',
    merchantImage: '',
    securityCode: '',
  };

  constructor(
    public balanceService: BalanceService,
    public popupService: PopupService,
    public utilsService: UtilsService,
    private store: Store<State>
  ) {}

  ngOnInit() {
    this.initFormWithMemo();

    this.store
      .pipe(select(getCryptoCurrenciesForChoose))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currencies => {
        this.cryptoNames = currencies;
        this.setActiveCrypto();
        this.getCryptoInfoByName(this.activeCrypto.name);
      });

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

  onSubmitWithdrawal() {
    this.formAmount.updateValueAndValidity();
    this.isSubmited = true;
    if (this.form.valid) {
      this.VIEW = this.viewsList.CAPTCHA;
    }
  }

  setActiveCrypto() {
    let currency;
    if (this.balanceData && this.balanceData.currencyId) {
      currency = this.cryptoNames.filter(item => +item.id === +this.balanceData.currencyId);
    }
    this.activeCrypto = currency && currency.length ? currency[0] : this.cryptoNames[0];
  }

  afterResolvedCaptcha(event) {
    if (this.cryptoInfoByName) {
      this.model.currency = this.cryptoInfoByName.merchantCurrencyData[0].currencyId;
      this.model.merchant = this.cryptoInfoByName.merchantCurrencyData[0].merchantId;
      this.model.merchantImage = this.cryptoInfoByName.merchantCurrencyData[0].listMerchantImage[0].id;
      this.model.sum = this.formAmount.value;
      this.model.currencyName = this.activeCrypto.name || '';
      this.model.destination = this.formAddress.value;
      this.model.destinationTag = this.formMemo ? this.formMemo.value : '';
      const data = {
        isSentPin: false,
        operation: SEND_CRYPTO,
        data: this.model,
      };
      this.balanceService.goToPinCode$.next(data);
    }
  }

  goToWithdrawal() {
    this.VIEW = this.viewsList.MAIN;
  }

  balanceClick() {
    if (this.activeBalance && this.activeBalance > 0) {
      this.formAmount.setValue(this.utilsService.currencyFormat(this.activeBalance));
      this.formAmount.updateValueAndValidity();
      this.formAmount.markAsTouched();
    }
  }
  dailyLimitClick() {
    if (this.activeBalance && this.activeBalance > 0) {
      let amount = this.activeBalance;
      if (+this.activeBalance > +this.dailyLimit) {
        amount = this.dailyLimit;
      }
      this.formAmount.setValue(this.utilsService.currencyFormat(amount));
      this.formAmount.updateValueAndValidity();
      this.formAmount.markAsTouched();
    }
  }

  selectCurrency(currency) {
    this.form.reset();
    this.activeCrypto = currency;
    this.getCryptoInfoByName(currency.name);
  }

  private initFormWithMemo() {
    this.form = new FormGroup({
      memo: new FormControl(''),
      address: new FormControl('', [Validators.required]),
      amount: new FormControl('', [
        Validators.required,
        this.isMaxThenActiveBalance.bind(this),
        this.isMaxThenDailyLimit.bind(this),
        this.isMinThenMinWithdraw.bind(this),
      ]),
    });
  }

  get formAmount() {
    return this.form.controls['amount'];
  }
  get formAddress() {
    return this.form.controls['address'];
  }
  get formMemo() {
    return this.form.controls['memo'];
  }

  private getCryptoInfoByName(name: string) {
    this.balanceService
      .getCurrencyData(name)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.cryptoInfoByName = res;
        this.activeBalance = this.cryptoInfoByName.activeBalance;
        this.dailyLimit = this.cryptoInfoByName.leftDailyWithdrawAmount;
        if (this.cryptoInfoByName.merchantCurrencyData.length) {
          this.isMemo = this.cryptoInfoByName.merchantCurrencyData[0].additionalTagForWithdrawAddressIsUsed;
          this.memoName = this.cryptoInfoByName.merchantCurrencyData[0].additionalFieldName;
          this.minWithdrawSum =
            this.cryptoInfoByName.minWithdrawSum > parseFloat(this.cryptoInfoByName.merchantCurrencyData[0].minSum)
              ? this.cryptoInfoByName.minWithdrawSum
              : parseFloat(this.cryptoInfoByName.merchantCurrencyData[0].minSum);
        }
        if (this.activeCrypto && this.cryptoInfoByName) {
          this.VIEW = this.viewsList.MAIN;
        }
      }, err => {
        if (err.error && err.error.tittle === 'USER_OPERATION_DENIED') {
          this.VIEW = this.viewsList.DENIED;
        }
        if (this.activeCrypto && this.cryptoInfoByName) {
          this.VIEW = this.viewsList.MAIN;
        }
      });
  }

  isMaxThenActiveBalance(control = { value: 0 }): { [key: string]: any } | null {
    if (+this.activeBalance < +control.value) {
      return { isMaxThenActiveBalance: true };
    }
    return null;
  }

  isMaxThenDailyLimit(control = { value: 0 }): { [key: string]: any } | null {
    if (+this.dailyLimit < +control.value) {
      return { isMaxThenDailyLimit: true };
    }
    return null;
  }

  isMinThenMinWithdraw(control = { value: 0 }): { [key: string]: any } | null {
    if (+this.minWithdrawSum > +control.value) {
      return { isMinThenMinWithdraw: true };
    }
    return null;
  }

  get currName() {
    return this.activeCrypto ? this.activeCrypto.name : '';
  }

  get isMerchantData() {
    return this.cryptoInfoByName && this.cryptoInfoByName.merchantCurrencyData.length;
  }

  get isDisabledForm() {
    return this.formAmount.invalid || this.formAddress.invalid || !this.selectCurrency ;
  }

}
