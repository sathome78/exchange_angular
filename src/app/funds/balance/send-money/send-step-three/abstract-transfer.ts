import { HostListener, Input, OnDestroy } from '@angular/core';
import { keys } from '../../../../shared/constants';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { select } from '@ngrx/store';
import * as _uniq from 'lodash/uniq';
import { getAllCurrenciesForChoose } from '../../../../core/reducers';

export abstract class AbstractTransfer implements OnDestroy {
  @Input() balanceData;
  @Input() userEmail = '';
  public cryptoNames;
  public defaultCryptoNames;
  public openCurrencyDropdown = false;
  public recaptchaKey = keys.recaptchaKey;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  public activeCrypto;
  public isSubmited = false;
  public pendingCheckEmail = false;
  public activeBalance = 0;
  public isEnterData = true;
  public amountValue = 0;
  public alphabet;
  public responseCommission;
  public form: FormGroup;
  public minWithdrawSum = 0;
  public abstract balanceService;
  protected abstract store;
  public abstract model;
  public loadingBalance: boolean = false;

  responseDefaultCommission = {
    companyCommissionAmount: '0',
    amount: '0',
    totalCommissionAmount: '0',
    companyCommissionRate: '0',
    merchantCommissionRate: `(0%, but not less than 0)`,
    merchantCommissionAmount: '0',
    resultAmount: '0',
    addition: '0',
  };

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.className !== 'select__value select__value--active' && $event.target.className !== 'select__search-input') {
      this.openCurrencyDropdown = false;
    }
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
        if (this.activeCrypto) this.getBalance(this.activeCrypto.name);
        this.getMinSum(this.activeCrypto);
      });
  }

  setActiveCurrency() {
    let currency;
    if (this.balanceData && this.balanceData.currencyId) {
      currency = this.cryptoNames.filter(item => +item.id === +this.balanceData.currencyId);
    }
    this.activeCrypto = currency && currency.length ? currency[0] : this.cryptoNames[0];
  }

  getMinSum(currency) {
    if (currency) {
      this.balanceService
        .getMinSumInnerTranfer(currency.id.toString(), this.model.type)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((res: { data: string; error: string }) => {
          this.minWithdrawSum = +res.data;
        });
    }
  }

  getBalance(name: string) {
    this.balanceService
      .getTotalBalance()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        const allBalances = res as { sumTotalUSD: any; mapWallets: any };
        const needBalance = allBalances.mapWallets.filter(item => item.currencyName === name);
        this.activeBalance = needBalance[0].activeBalance;
      });
  }

  amountBlur(event) {
    if (event && this.form.controls['amount'].valid) this.getCommissionInfo(this.amountValue);
  }

  getCommissionInfo(amount) {
    if (this.activeCrypto) {
      this.loadingBalance = true;
      this.balanceService
        .getCommisionInfo(this.activeCrypto.id, amount, this.model.type)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          res => {
            this.responseCommission = res as any;
            this.loadingBalance = false;
          },
          err => {
            console.error(err);
            this.loadingBalance = false;
          }
        );
    }
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
      this.form.controls['amount'].setErrors(null);
      this.getCommissionInfo(this.activeBalance);
      this.amountValue = this.activeBalance;
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

  checkEmailOfServer() {
    const email = this.form.controls['email'];
    if (email.value) email.markAsTouched();

    if (email.value === this.userEmail) {
      email.setErrors({ ownEmail: true });
    }

    if (email.valid && email.value !== this.userEmail) {
      this.pendingCheckEmail = true;
      this.balanceService
        .checkEmail(email.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          res => {
            email.setErrors(null);
            this.pendingCheckEmail = false;
          },
          error => {
            if (error['status'] === 400) {
              email.setErrors({ USER_EMAIL_NOT_FOUND: true });
            } else {
              email.setErrors({ checkEmailCrash: true });
            }
            this.pendingCheckEmail = false;
          }
        );
    } else {
      this.pendingCheckEmail = false;
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
