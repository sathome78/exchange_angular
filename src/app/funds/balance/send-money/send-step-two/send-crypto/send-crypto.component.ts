import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, takeUntil} from 'rxjs/operators';
import * as _uniq from 'lodash/uniq';
import {Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CurrencyBalanceModel} from '../../../../../model/index';
import {BalanceService} from '../../../../services/balance.service';
import {keys} from '../../../../../core/keys';
import {select, Store} from '@ngrx/store';
import {getCryptoCurrenciesForChoose, State} from 'app/core/reducers';
import {SEND_CRYPTO} from '../../send-money-constants';
import {CommissionData} from '../../../../models/commission-data.model';
import {defaultCommissionData} from '../../../../store/reducers/default-values';
import {environment} from '../../../../../../environments/environment';
import {PopupService} from '../../../../../shared/services/popup.service';
import {BalanceItem} from '../../../../models/balance-item.model';

@Component({
  selector: 'app-send-crypto',
  templateUrl: './send-crypto.component.html',
  styleUrls: ['./send-crypto.component.scss']
})
export class SendCryptoComponent implements OnInit, OnDestroy {

  @Input() balanceData: BalanceItem;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public recaptchaKey = keys.recaptchaKey;
  public cryptoNames: CurrencyBalanceModel[] = [];
  public defaultCryptoNames: CurrencyBalanceModel[] = [];
  public openCurrencyDropdown = false;
  public cryptoInfoByName;
  public activeBalance = 0;
  public minWithdrawSum = 0;
  public isSubmited = false;
  public isEnterData = true;
  public alphabet;
  public isMemo;
  public isAmountMax;
  public isAmountMin;
  public activeCrypto;
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
    }
  }

  constructor(
    public balanceService: BalanceService,
    public popupService: PopupService,
    private store: Store<State>,
  ) {
  }

  ngOnInit() {
    this.initFormWithMemo();

    this.form.controls['amount'].valueChanges
      .pipe(debounceTime(1000))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res !== '0') {
          this.calculateCommission(res);
        }
      });

    this.store
      .pipe(select(getCryptoCurrenciesForChoose))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currencies => {
        this.defaultCryptoNames = currencies;
        this.cryptoNames = this.defaultCryptoNames;
        this.setActiveCrypto();
        this.prepareAlphabet();
        if (this.activeCrypto) this.getCryptoInfoByName(this.activeCrypto.name);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmitWithdrawal() {
    this.isSubmited = true;
    if (environment.production) {
      // todo while insecure
      this.popupService.demoPopupMessage = 0;
      this.popupService.showDemoTradingPopup(true);
      this.balanceService.closeSendMoneyPopup$.next(false);
    } else {
      if (this.form.valid && !this.isAmountMax && !this.isAmountMin) {
        this.isEnterData = false;
      }
    }
  }

  setActiveCrypto() {
    let currency;
    if (this.balanceData && this.balanceData.currencyId) {
      currency = this.cryptoNames.filter(item => +item.id === +this.balanceData.currencyId);
    }
    this.activeCrypto = (currency && currency.length) ? currency[0] : this.cryptoNames[0];
  }

  afterResolvedCaptcha(event) {
    this.model.currency = this.cryptoInfoByName.merchantCurrencyData[0].currencyId;
    this.model.merchant = this.cryptoInfoByName.merchantCurrencyData[0].merchantId;
    this.model.recipientBankName = this.cryptoInfoByName.merchantCurrencyData[0].description;
    this.model.merchantImage = this.cryptoInfoByName.merchantCurrencyData[0].listMerchantImage[0].image_path;
    this.model.operationType = this.cryptoInfoByName.operationType;
    this.model.sum = this.form.controls['amount'].value;
    this.model.walletNumber = this.form.controls['address'].value;
    this.model.destinationTag = this.form.controls['memo'] ? this.form.controls['memo'].value : '';
    const data = {
      isSentPin: false,
      operation: SEND_CRYPTO,
      data: this.model
    };
    this.balanceService.goToPinCode$.next(data);
  }

  goToWithdrawal() {
    this.isEnterData = true;
  }

  searchCoin(e) {
    this.cryptoNames = this.defaultCryptoNames.filter(f => f.name.toUpperCase().match(e.target.value.toUpperCase()));
    this.prepareAlphabet();
  }

  amountInput(event) {
    // this.calculateCommission(event.target.value);
    this.amountValidator(event.target.value);
  }

  balanceClick() {
    if (this.activeBalance > this.minWithdrawSum) {
      this.form.controls['amount'].setValue(this.activeBalance.toString());
      this.calculateCommission(this.activeBalance);
    }
  }

  calculateCommission(amount) {
    this.balanceService
      .getCommissionToWithdraw(amount, this.activeCrypto.id, this.cryptoInfoByName.merchantCurrencyData[0].merchantId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.calculateData = res as CommissionData;
      });
  }

  /**
   * Method transform exponent format to number
   * @param x
   * @returns {any}
   */
  exponentToNumber(x) {
    if (Math.abs(x) < 1.0) {
      let e = parseInt(x.toString().split('e-')[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      let e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += (new Array(e + 1)).join('0');
      }
    }
    return x;
  }

  selectCurrency(currency) {
    this.form.reset();
    this.activeCrypto = currency;
    this.currencyDropdownToggle();
    this.getCryptoInfoByName(currency.name);
  }

  currencyDropdownToggle() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.cryptoNames = this.defaultCryptoNames;
    this.prepareAlphabet();
  }

  private initFormWithMemo() {
    this.form = new FormGroup({
      memo: new FormControl('', [this.isRequired.bind(this)]),
      address: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
    });
  }

  private getCryptoInfoByName(name: string) {
    this.calculateData = defaultCommissionData;
    this.balanceService.getCryptoMerchants(name)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.cryptoInfoByName = res;
        this.isMemo = this.cryptoInfoByName.merchantCurrencyData[0].additionalFieldName;
        this.activeBalance = this.cryptoInfoByName.activeBalance;
        this.minWithdrawSum = this.cryptoInfoByName.merchantCurrencyData[0].minSum;
      });
  }

  private prepareAlphabet() {
    const temp = [];
    this.cryptoNames.forEach(currency => {
      const letter = currency.name.toUpperCase()[0];
      temp.push(letter);
    });
    const unique = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    this.alphabet = _uniq(temp.filter(unique).sort());
  }

  private isRequired(memo: FormControl) {
    if (this.isMemo && !memo.value) {
      return {'required': true};
    }
    return null;
  }

  amountValidator(sum) {
    this.isAmountMax = +sum >= +this.activeBalance ? true : false;
    this.isAmountMin = +sum <= +this.minWithdrawSum ? true : false;
  }
}
