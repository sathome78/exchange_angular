import { HostListener, Input, OnDestroy } from '@angular/core';
import { keys } from '../../../../shared/constants';
import { Subject } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { select } from '@ngrx/store';
import * as _uniq from 'lodash/uniq';
import { getAllCurrenciesForChoose } from '../../../../core/reducers';
import { BalanceItem } from 'app/funds/models/balance-item.model';

export abstract class AbstractTransfer implements OnDestroy {
  @Input() balanceData;
  @Input() userEmail = '';
  public cryptoNames;
  public openCurrencyDropdown = false;
  public recaptchaKey = keys.recaptchaKey;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  public activeCrypto;
  public isSubmited = false;
  public pendingCheckEmail = false;
  public activeBalance = 0;
  public isEnterData = true;
  public alphabet;
  public responseCommission;
  public form: FormGroup;
  public minWithdrawSum = 0;
  public abstract balanceService;
  public abstract utilsService;
  protected abstract store;
  public abstract model;
  public loadingBalance = false;

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

  getAllNames() {
    this.store
      .pipe(select(getAllCurrenciesForChoose))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currencies => {
        this.cryptoNames = currencies;
        this.setActiveCurrency();
        this.getBalance(this.activeCrypto);
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
    if (currency && this.model) {
      this.balanceService
        .getMinSumInnerTranfer(currency.id.toString(), this.model.type)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((res: { data: string; error: string }) => {
          this.minWithdrawSum = +res.data;
        });
    }
  }

  getBalance(activeCrypto) {
    const type = this.utilsService.isFiat(activeCrypto.name) ? 'FIAT' : 'CRYPTO';
    this.balanceService
      .getBalanceByName(activeCrypto.id, type)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: BalanceItem) => {
        this.activeBalance = res.activeBalance;
      });
  }

  amountBlur() {
    if (this.formAmount.valid && this.formAmount.value) {
      this.getCommissionInfo(this.formAmount.value);
    }
  }

  getCommissionInfo(amount) {
    if (this.activeCrypto && this.model) {
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

  selectCurrency(currency) {
    this.form.reset();
    this.isSubmited = false;
    this.responseCommission = this.responseDefaultCommission;
    this.activeCrypto = currency;
    this.getBalance(this.activeCrypto);
    this.getMinSum(this.activeCrypto);
  }

  balanceClick() {
    if (this.activeBalance > this.minWithdrawSum) {
      this.formAmount.setValue(this.utilsService.currencyFormat(this.activeBalance));
      this.formAmount.setErrors(null);
      this.getCommissionInfo(this.activeBalance);
    }
  }

  goToForm() {
    this.isEnterData = true;
  }

  isMaxThenActiveBalance(control = { value: 0 }): { [key: string]: any } | null {
    if (+this.activeBalance < +control.value) {
      return { isMaxThenActiveBalance: true };
    }
    return null;
  }

  isMinThenMinWithdraw(control = { value: 0 }): { [key: string]: any } | null {
    if (+this.minWithdrawSum > +control.value) {
      return { isMinThenMinWithdraw: true };
    }
    return null;
  }

  checkEmailOfServer() {
    const email = this.formEmail;
    if (email.value) {
      email.markAsTouched();
    }

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

  // form getters

  get formAmount() {
    return this.form.controls['amount'];
  }
  get formEmail() {
    return this.form.controls['email'];
  }
}
