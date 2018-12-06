import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import * as _uniq from 'lodash/uniq';
import {Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CurrencyBalanceModel} from '../../../../../model/index';
import {BalanceService} from '../../../../../shared/services/balance.service';
import {MockDataService} from '../../../../../shared/services/mock-data.service';

@Component({
  selector: 'app-send-crypto',
  templateUrl: './send-crypto.component.html',
  styleUrls: ['./send-crypto.component.scss']
})
export class SendCryptoComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public cryptoNames: CurrencyBalanceModel[] = [];
  public defaultCryptoNames: CurrencyBalanceModel[] = [];
  public openCurrencyDropdown = false;
  public cryptoInfoByName;
  public activeBalance = 0;
  public minWithdrawSum = 0;
  public isSubmited = false;
  public alphabet;
  public isMemo;
  public activeCrypto;
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
    walletNumber: ''
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
    }
  }

  constructor(
    public balanceService: BalanceService,
    public mockDataService: MockDataService,
  ) { }

  ngOnInit() {
    // this.initForm();
    this.initFormWithMemo();
    // /**-------mock data------**/
    // this.defaultCryptoNames = this.mockDataService.getCryptoName();
    // this.cryptoNames = this.defaultCryptoNames;
    // this.cryptoInfoByName = this.mockDataService.getCryptoData();
    // this.activeCrypto = this.cryptoNames[0];
    // this.prepareAlphabet();
    // /**----------------------**/
    this.balanceService.getCryptoNames()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.defaultCryptoNames = res;
        this.cryptoNames = this.defaultCryptoNames;
        this.activeCrypto = this.cryptoNames[0];
        this.prepareAlphabet();
        this.getCryptoInfoByName(this.activeCrypto.name);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmitWithdrawal() {
    this.isSubmited = true;
    if (this.form.valid) {


    }
  }

  searchCoin(e) {
    this.cryptoNames = this.defaultCryptoNames.filter(f => f.name.toUpperCase().match(e.target.value.toUpperCase()));
    this.prepareAlphabet();
  }

  amountInput(event) {
    this.calculateCommission(event.target.value);
  }

  balanceClick() {
    if (this.activeBalance > this.minWithdrawSum) {
      this.form.controls['amount'].setValue(this.activeBalance.toString());
      this.calculateCommission(this.activeBalance);
    }
  }

  calculateCommission(amount) {
    this.calculateData.amount = amount;
    this.calculateData.merchantSum = amount * ( this.calculateData.percentMerchant / 100);
    this.calculateData.totalCommissionSum = this.calculateData.merchantSum + this.calculateData.exchangeSum;
    this.calculateData.amountWithCommission = amount - this.calculateData.totalCommissionSum;
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
      memo: new FormControl('', [this.isRequired.bind(this)] ),
      address: new FormControl('', [Validators.required] ),
      amount: new FormControl('', [Validators.required, this.minCheck.bind(this), this.maxCheck.bind(this)] ),
    });
  }

  private getCryptoInfoByName(name: string) {
    // /** mock*/
    // this.cryptoInfoByName = this.mockDataService.getSendCrypto();
    // this.isMemo = this.cryptoInfoByName.merchantCurrencyData[0].additionalFieldName;
    // this.isMemo ? this.initFormWithMemo() : this.initForm();
    // this.activeBalance = this.cryptoInfoByName.activeBalance;
    // this.minWithdrawSum = this.cryptoInfoByName.merchantCurrencyData[0].minSum;
    // /**-------------*/
    this.balanceService.getCryptoMerchants(name).subscribe(res => {
      this.cryptoInfoByName = res;
      this.isMemo = this.cryptoInfoByName.merchantCurrencyData[0].additionalFieldName;
      this.activeBalance = this.cryptoInfoByName.activeBalance;
      this.minWithdrawSum = this.cryptoInfoByName.merchantCurrencyData[0].minSum;
      this.calculateData.percentMerchant = this.cryptoInfoByName.merchantCurrencyData[0].outputCommission;
      this.calculateData.fixedMinCommissiom = this.cryptoInfoByName.merchantCurrencyData[0].fixedMinCommission;
      this.calculateData.totalCommission = this.calculateData.percentMerchant + this.calculateData.percentExchange;
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
    }
    this.alphabet = _uniq(temp.filter(unique).sort());
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
  private isRequired(memo: FormControl) {
    if (this.isMemo && !memo.value) {
      return {'required': true};
    }
    return null;
  }
}
