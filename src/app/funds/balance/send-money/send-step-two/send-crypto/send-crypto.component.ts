import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, takeUntil} from 'rxjs/operators';
import * as _uniq from 'lodash/uniq';
import {Subject} from 'rxjs';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {CurrencyBalanceModel} from '../../../../../model/index';
import {BalanceService} from '../../../../services/balance.service';
import {keys} from '../../../../../shared/constants';
import {select, Store} from '@ngrx/store';
import {getCryptoCurrenciesForChoose, State} from 'app/core/reducers';
import {SEND_CRYPTO} from '../../send-money-constants';
import {CommissionData} from '../../../../models/commission-data.model';
import {defaultCommissionData} from '../../../../store/reducers/default-values';
import {environment} from '../../../../../../environments/environment';
import {PopupService} from 'app/shared/services/popup.service';
import {BalanceItem} from '../../../../models/balance-item.model';
import {UtilsService} from 'app/shared/services/utils.service';

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
  public amountValue = 0;
  public cryptoInfoByName;
  public activeBalance = 0;
  public minWithdrawSum = 0;
  public isSubmited = false;
  public isEnterData = true;
  public alphabet;
  public isMemo;
  public memoName = '';
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
    private utilsService: UtilsService,
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
        this.activeCrypto = currencies[0];
        this.getCryptoInfoByName(this.activeCrypto.name);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmitWithdrawal() {
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
    if (this.cryptoInfoByName) {
      this.model.currency = this.cryptoInfoByName.merchantCurrencyData[0].currencyId;
      this.model.merchant = this.cryptoInfoByName.merchantCurrencyData[0].merchantId;
      this.model.merchantImage = this.cryptoInfoByName.merchantCurrencyData[0].listMerchantImage[0].id;
      this.model.sum = this.form.controls['amount'].value;
      this.model.destination = this.form.controls['address'].value;
      this.model.destinationTag = this.form.controls['memo'] ? this.form.controls['memo'].value : '';
      const data = {
        isSentPin: false,
        operation: SEND_CRYPTO,
        data: this.model
      };
      this.balanceService.goToPinCode$.next(data);
    }
  }

  goToWithdrawal() {
    this.isEnterData = true;
  }

  searchCoin(e) {
    this.cryptoNames = this.defaultCryptoNames.filter(f => f.name.toUpperCase().match(e.target.value.toUpperCase()));
    this.prepareAlphabet();
  }

  balanceClick() {
    if (this.activeBalance >= this.minWithdrawSum) {
      this.form.controls['amount'].setValue(this.activeBalance.toString());
      this.calculateCommission(this.activeBalance);
      this.amountValue = this.activeBalance;
    }
  }

  calculateCommission(amount) {
    if (this.activeCrypto) {
      this.balanceService
        .getCommissionToWithdraw(amount, this.activeCrypto.id, this.cryptoInfoByName.merchantCurrencyData[0].merchantId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.calculateData = res as CommissionData;
        });
    }
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
      amount: new FormControl('', [
        Validators.required,
        this.isMaxThenActiveBalance.bind(this),
        this.isMinThenMinWithdraw.bind(this)
      ]),
    });
  }

  private getCryptoInfoByName(name: string) {
    this.calculateData = defaultCommissionData;
    this.balanceService.getCryptoMerchants(name)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.cryptoInfoByName = res;
        this.isMemo = this.cryptoInfoByName.merchantCurrencyData[0].additionalTagForWithdrawAddressIsUsed ;
        this.memoName = this.cryptoInfoByName.merchantCurrencyData[0].additionalFieldName ;
        this.activeBalance = this.cryptoInfoByName.activeBalance;
        this.minWithdrawSum = this.cryptoInfoByName.minWithdrawSum;
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

  amountInput(event) {
    this.calculateCommission(event.target.value);
    this.amountValue = event.target.value;
  }

  isMaxThenActiveBalance(): {[key: string]: any} | null {
    if (+this.activeBalance < +this.amountValue) {
      return {'isMaxThenActiveBalance': true};
    }
    return null;
  }

  isMinThenMinWithdraw(): {[key: string]: any} | null {
    if (+this.minWithdrawSum > +this.amountValue) {
      return {'isMinThenMinWithdraw': true};
    }
    return null;
  }
}
