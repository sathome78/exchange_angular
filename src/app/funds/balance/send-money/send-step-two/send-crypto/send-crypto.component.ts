import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import * as _uniq from 'lodash/uniq';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CurrencyBalanceModel } from '../../../../../model/index';
import { BalanceService } from '../../../../services/balance.service';
import { keys } from '../../../../../shared/constants';
import { select, Store } from '@ngrx/store';
import { getCryptoCurrenciesForChoose, getUserInfo, State } from 'app/core/reducers';
import { SEND_CRYPTO } from '../../send-money-constants';
import { CommissionData } from '../../../../models/commission-data.model';
import { defaultCommissionData } from '../../../../store/reducers/default-values';
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
  public activeCrypto;
  public form: FormGroup;
  public calculateData: CommissionData = defaultCommissionData;
  public loadingBalance = false;
  public userInfo: ParsedToken;

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

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if (
      $event.target.className !== 'select__value select__value--active' &&
      $event.target.className !== 'select__search-input'
    ) {
      this.openCurrencyDropdown = false;
    }
  }

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
        this.defaultCryptoNames = currencies;
        this.cryptoNames = this.defaultCryptoNames;
        this.setActiveCrypto();
        this.prepareAlphabet();
        if (this.activeCrypto) {
          this.getCryptoInfoByName(this.activeCrypto.name);
        }
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
    this.form.get('amount').updateValueAndValidity();
    this.isSubmited = true;
    if (this.form.valid) {
      this.isEnterData = false;
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
      this.model.sum = this.form.controls['amount'].value;
      this.model.currencyName = this.activeCrypto.name || '';
      this.model.destination = this.form.controls['address'].value;
      this.model.destinationTag = this.form.controls['memo'] ? this.form.controls['memo'].value : '';
      const data = {
        isSentPin: false,
        operation: SEND_CRYPTO,
        data: this.model,
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
    if (this.activeBalance && this.activeBalance > 0) {
      this.form.controls['amount'].setValue(this.activeBalance.toString());
      this.calculateCommission(this.activeBalance);
      this.amountValue = this.activeBalance;
      this.form.controls['amount'].updateValueAndValidity();
      this.form.controls['amount'].markAsTouched();
    }
  }

  amountBlur(event) {
    if (event && this.form.controls['amount'].valid) { this.calculateCommission(this.amountValue); }
  }

  calculateCommission(amount) {
    if (this.activeCrypto && amount !== 0) {
      this.loadingBalance = true;
      this.balanceService
        .getCommissionToWithdraw(amount, this.activeCrypto.id, this.cryptoInfoByName.merchantCurrencyData[0].merchantId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          res => {
            this.calculateData = res as CommissionData;
            const compCommission = parseFloat(
              this.calculateData.companyCommissionRate.replace('%)', '').replace('(', '')
            );
            this.calculateData.commission_rates_sum =
              +this.cryptoInfoByName.merchantCurrencyData[0].outputCommission +
              (Number.isNaN(compCommission) ? compCommission : 0);
            this.loadingBalance = false;
          },
          err => {
            this.loadingBalance = false;
            console.error(err);
          }
        );
    } else {
      try {
        this.calculateData.merchantCommissionRate = `(${
          this.cryptoInfoByName.merchantCurrencyData[0].outputCommission
        }%, but not less than ${this.cryptoInfoByName.merchantCurrencyData[0].fixedMinCommission} USD)`;
      } catch (e) {}
    }
  }

  selectCurrency(currency) {
    this.form.reset();
    this.activeCrypto = currency;
    this.currencyDropdownToggle();
    this.getCryptoInfoByName(currency.name);
    this.calculateCommission(0);
  }

  currencyDropdownToggle() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.cryptoNames = this.defaultCryptoNames;
    this.prepareAlphabet();
  }

  private initFormWithMemo() {
    this.form = new FormGroup({
      memo: new FormControl(''),
      address: new FormControl('', [Validators.required]),
      amount: new FormControl('', [
        Validators.required,
        this.isMaxThenActiveBalance.bind(this),
        this.isMinThenMinWithdraw.bind(this),
      ]),
    });
  }

  private getCryptoInfoByName(name: string) {
    this.calculateData = defaultCommissionData;
    this.balanceService
      .getCryptoMerchants(name)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.cryptoInfoByName = res;
        this.activeBalance = this.cryptoInfoByName.activeBalance;
        if (this.cryptoInfoByName.merchantCurrencyData.length) {
          this.isMemo = this.cryptoInfoByName.merchantCurrencyData[0].additionalTagForWithdrawAddressIsUsed;
          this.memoName = this.cryptoInfoByName.merchantCurrencyData[0].additionalFieldName;
          this.minWithdrawSum =
            this.cryptoInfoByName.minWithdrawSum > parseFloat(this.cryptoInfoByName.merchantCurrencyData[0].minSum)
              ? this.cryptoInfoByName.minWithdrawSum
              : parseFloat(this.cryptoInfoByName.merchantCurrencyData[0].minSum);
          this.calculateCommission(0);
        }
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
      return { required: true };
    }
    return null;
  }

  amountInput(event) {
    this.amountValue = event.target.value;
  }

  isMaxThenActiveBalance(): { [key: string]: any } | null {
    if (+this.activeBalance < +this.amountValue) {
      return { isMaxThenActiveBalance: true };
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
    return this.activeCrypto ? this.activeCrypto.name : '';
  }

  trackByAlphabet(index, item) {
    return item;
  }

  trackByCryptoNames(index, item) {
    return item.id;
  }
}
