import { Component, OnInit, Input } from '@angular/core';
import { BalanceService } from '../../../../services/balance.service';
import { takeUntil, tap, debounceTime } from 'rxjs/operators';
import { BalanceItem } from 'app/funds/models/balance-item.model';
import { Subject, Subscription } from 'rxjs';
import { TransferMerchantResponse, TransferMerchant } from 'app/funds/models/transfer-models.model';
import { UtilsService } from 'app/shared/services/utils.service';
import { Store, select } from '@ngrx/store';
import { State, getUserInfo, getAllCurrenciesForChoose } from 'app/core/reducers';
import { TransferFormModel } from 'app/funds/models/transfer-form.model';
import { CurrencyChoose } from 'app/model/currency-choose.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TRANSFER_INSTANT, BY_PRIVATE_CODE } from '../../send-money-constants';
import { keys } from 'app/shared/constants';

@Component({
  selector: 'app-send-inner-transfer',
  templateUrl: './send-inner-transfer.component.html',
  styleUrls: ['./send-inner-transfer.component.scss'],
})
export class SendInnerTransferComponent implements OnInit {
  @Input() balanceData: BalanceItem;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public recaptchaKey = keys.recaptchaKey;
  private formEmailSub$: Subscription;
  public loading = true;
  public pendingCheckEmail = false;
  public isSubmited = false;
  public merchantData: TransferMerchant[] = [];
  public viewsList = {
    LOADING: 'loading',
    ERROR: 'error',
    MAIN: 'main',
    DENIED: 'denied',
    CAPTCHA: 'captcha',
  };
  public merchNames = {
    SIMPLE: 'SimpleTransfer',
    VOUCHER: 'VoucherTransfer',
    VOUCHERFREE: 'VoucherFreeTransfer',
  };

  public activeMerchant: TransferMerchant = null;
  public VIEW = this.viewsList.LOADING;
  public openDropdown = true;
  public model = null;
  public currencies: CurrencyChoose[] = [];
  public activeCurr: CurrencyChoose = null;
  public form: FormGroup;
  public activeBalance = 0;
  public userEmail = '';

  constructor(
    public balanceService: BalanceService,
    public utilsService: UtilsService,
    protected store: Store<State>
  ) { }

  ngOnInit() {
    this.initForm();
    this.setView(this.viewsList.LOADING);
    this.getAllNames();
    this.getMerchants(this.balanceData ? this.balanceData.currencyName : null);
  }

  chooseTransfer(name: string, merchant) {
    this.balanceService.goToSendMoneyInnerTransfer$.next({ name, merchant });
  }

  setView(view) {
    this.VIEW = view;
  }

  setActiveCurrency() {
    let currency;
    if (this.balanceData && this.balanceData.currencyId) {
      currency = this.currencies.filter(item => +item.id === +this.balanceData.currencyId);
    }
    this.activeCurr = currency && currency.length ? currency[0] : null;

  }

  selectMerchant(merchant) {
    this.activeMerchant = merchant;
    if (this.activeMerchant) {
      this.model = new TransferFormModel(this.activeMerchant.name, this.activeCurr);
      if (this.activeMerchant.name === this.merchNames.SIMPLE || this.activeMerchant.name === this.merchNames.VOUCHER) {
        this.addEmailToForm();
      } else {
        this.removeEmailFromForm();
      }
    } else {
      this.removeEmailFromForm();
    }
  }

  submitTransfer() {
    this.formAmount.updateValueAndValidity();
    this.isSubmited = true;
    if (this.form.valid) {
      this.setView(this.viewsList.CAPTCHA);
    }
  }

  getMerchants(currName) {
    this.balanceService
      .getTransferMerchants(currName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (res: TransferMerchantResponse) => {
          this.merchantData = res.merchantCurrencies;
          if (this.merchantData && this.merchantData.length && res.operationRestrictedToUser) {
            this.setView(this.viewsList.DENIED);
          } else {
            this.setView(this.viewsList.MAIN);
          }
        },
        err => {
          this.setView(this.viewsList.ERROR);
          console.error(err);
        }
      );
  }

  getAllNames() {
    this.store
      .pipe(select(getAllCurrenciesForChoose))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currencies => {
        this.currencies = currencies;
        this.setActiveCurrency();
        if (this.activeCurr) {
          this.getBalance(this.activeCurr);
        }
      });
  }

  getBalance(activeCurr) {
    const type = this.utilsService.isFiat(activeCurr.name) ? 'FIAT' : 'CRYPTO';
    this.balanceService
      .getBalanceByName(activeCurr.id, type)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: BalanceItem) => {
        this.activeBalance = res.activeBalance;
      });
  }

  getUserEmail() {
    this.store
      .pipe(select(getUserInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userInfo: ParsedToken) => {
        this.userEmail = userInfo.username;
      });
  }

  selectCurrency(currency) {
    this.form.reset();
    this.isSubmited = false;
    this.selectMerchant(null);
    this.activeCurr = currency;
    this.getBalance(this.activeCurr);
    this.getMerchants(this.activeCurrName);
  }

  afterResolvedCaptcha(event) {
    if (this.formEmail) {
      this.model.recipient = this.formEmail.value;
    }
    this.model.currency = this.activeCurr.id;
    this.model.sum = this.amount;
    this.model.currencyName = this.activeCurrName;
    const data = {
      operation: this.getOperation(),
      data: this.model,
    };
    this.balanceService.goToPinCode$.next(data);
  }

  private getOperation() {
    switch (this.activeMerchName) {
      case 'SimpleTransfer':
        return TRANSFER_INSTANT;
      case 'VoucherTransfer':
        return BY_PRIVATE_CODE;
      case 'VoucherFreeTransfer':
        return BY_PRIVATE_CODE;
      default:
        return name;
    }
  }

  private initForm() {
    this.form = new FormGroup({
      amount: new FormControl('', {
        validators: [
          Validators.required,
          this.isMaxThenActiveBalance.bind(this),
          this.isMinThenMinWithdraw.bind(this)],
      }),
    });
  }

  private addEmailToForm() {
    this.form.addControl(
      'email', new FormControl('', { validators: [Validators.required, this.utilsService.emailValidator()] })
    );

    this.formEmailSub$ = this.formEmail.valueChanges
      .pipe(tap(() => (this.pendingCheckEmail = true)))
      .pipe(debounceTime(1000))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => this.checkEmailOfServer());
  }
  private removeEmailFromForm() {
    this.form.removeControl('email');
    this.formEmailSub$.unsubscribe();
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
  balanceClick() {
    if (this.activeBalance > this.minSumForTransfer) {
      this.formAmount.setValue(this.utilsService.currencyFormat(this.activeBalance));
      this.formAmount.setErrors(null);
      // this.getCommissionInfo(this.activeBalance);
    }
  }
  isMaxThenActiveBalance(control = { value: 0 }): { [key: string]: any } | null {
    if (+this.activeBalance < +control.value) {
      return { isMaxThenActiveBalance: true };
    }
    return null;
  }
  isMinThenMinWithdraw(control = { value: 0 }): { [key: string]: any } | null {
    if (+this.minSumForTransfer > +control.value) {
      return { isMinThenMinWithdraw: true };
    }
    return null;
  }

  get activeMerchName() {
    return this.activeMerchant && this.activeMerchant.name;
  }
  get activeCurrName() {
    return this.activeCurr && this.activeCurr.name;
  }
  get minSumForTransfer() {
    return this.activeMerchant ? this.activeMerchant.minTransferSum : 0;
  }
  get amount() {
    return this.activeMerchant &&
      this.formAmount &&
      this.formAmount.value >= this.minSumForTransfer ? this.formAmount.value : 0;
  }
  get merchantCommisionPercent() {
    return this.activeMerchant ? this.activeMerchant.transferCommission : 0;
  }
  get merchantCommisionValue() {
    return this.amount * this.merchantCommisionPercent;
  }
  get totalValue() {
    return this.amount - this.merchantCommisionValue;
  }

  // form getters
  get formAmount() {
    return this.form.controls['amount'];
  }
  get formEmail() {
    return this.form.controls['email'];
  }
}
