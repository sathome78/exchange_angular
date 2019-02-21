import {HostListener, Input} from '@angular/core';
import {keys} from '../../../../shared/constants';
import {Subject} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {select} from '@ngrx/store';
import * as _uniq from 'lodash/uniq';
import {getAllCurrenciesForChoose} from '../../../../core/reducers';

export abstract class AbstractTransfer {

  @Input() balanceData;
  public cryptoNames;
  public defaultCryptoNames;
  public openCurrencyDropdown = false;
  public recaptchaKey = keys.recaptchaKey;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  public activeCrypto;
  public isSubmited = false;
  public activeBalance;
  public isEnterData = true;
  public alphabet;
  public responseCommission;
  protected emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
  public isAmountMax;
  public isAmountMin;
  public form: FormGroup;
  public minWithdrawSum = 0;
  public emailErrorMessage = '';
  public abstract balanceService;
  protected abstract store;
  public abstract model;

  responseDefaultCommission = {
    companyCommissionAmount: '0',
    amount: '0',
    totalCommissionAmount: '0',
    companyCommissionRate: '0',
    merchantCommissionRate: `(0%, but not less than 0)`,
    merchantCommissionAmount: '0',
    resultAmount: '0',
    addition: '0'
  };

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.className !== 'select__value select__value--active' && $event.target.className !== 'select__search-input') {
      this.openCurrencyDropdown = false;
    }
  }

  getCommissionDebonce() {
    this.form.controls['amount'].valueChanges
      .pipe(debounceTime(1000))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (!this.isAmountMax && !this.isAmountMin) {
          this.getCommissionInfo(res);
        }
      });
  }

  getAllNames() {
    this.store
      .pipe(select(getAllCurrenciesForChoose))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currencies => {
        this.defaultCryptoNames = currencies;
        this.cryptoNames = this.defaultCryptoNames;
        this.setActiveCurrency();
        this.prepareAlphabet();
        this.getBalance(this.activeCrypto.name);
        this.getMinSum(this.activeCrypto);
      });
  }

  setActiveCurrency() {
    let currency;
    if (this.balanceData && this.balanceData.currencyId) {
      currency = this.cryptoNames.filter(item => +item.id === +this.balanceData.currencyId);
    }
    this.activeCrypto = (currency && currency.length) ? currency[0] : this.cryptoNames[0];
  }

  getMinSum(currency) {
    this.balanceService
      .getMinSumInnerTranfer(currency.id.toString(), this.model.type)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: { data: string, error: string }) => {
        this.minWithdrawSum = +res.data;
      });
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

  getCommissionInfo(amount) {
    this.balanceService.getCommisionInfo(this.activeCrypto.id, amount, this.model.type)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.responseCommission = res as any;
      });
  }

  currencyDropdownToggle() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.cryptoNames = this.defaultCryptoNames;
    this.prepareAlphabet();
  }

  prepareAlphabet() {
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

  selectCurrency(currency) {
    this.form.reset();
    this.isSubmited = false;
    this.responseCommission = this.responseDefaultCommission;
    this.activeCrypto = currency;
    this.getBalance(this.activeCrypto.name);
    this.getMinSum(this.activeCrypto);
    this.currencyDropdownToggle();
  }

  balanceClick() {
    if (this.activeBalance > this.minWithdrawSum) {
      this.form.controls['amount'].setValue(this.activeBalance.toString());
      this.getCommissionInfo(this.activeBalance);
    }
  }

  searchCoin(e) {
    this.cryptoNames = this.defaultCryptoNames.filter(f => f.name.toUpperCase().match(e.target.value.toUpperCase()));
    this.prepareAlphabet();
  }

  goToForm() {
    this.isEnterData = true;
  }

  amountInput(event) {
    this.amountValidator(event.target.value);
  }

  amountValidator(sum) {
    this.isAmountMax = +sum >= +this.activeBalance ? true : false;
    this.isAmountMin = +sum <= +this.minWithdrawSum ? true : false;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
