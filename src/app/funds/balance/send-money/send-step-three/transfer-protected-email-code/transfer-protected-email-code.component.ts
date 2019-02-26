import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BalanceService} from '../../../../services/balance.service';
import {State} from '../../../../../core/reducers';
import {Store} from '@ngrx/store';
import {BY_PRIVATE_CODE} from '../../send-money-constants';
import {AbstractTransfer} from '../abstract-transfer';
import {environment} from '../../../../../../environments/environment';
import {PopupService} from '../../../../../shared/services/popup.service';
import {takeUntil} from 'rxjs/operators';
import {UserService} from '../../../../../shared/services/user.service';
import {AUTH_MESSAGES} from 'app/shared/constants';

@Component({
  selector: 'app-transfer-protected-email-code',
  templateUrl: './transfer-protected-email-code.component.html',
  styleUrls: ['./transfer-protected-email-code.component.scss']
})
export class TransferProtectedEmailCodeComponent extends AbstractTransfer implements OnInit, OnDestroy {

  public AUTH_MESSAGES = AUTH_MESSAGES;
  public model = {
    operationType: 'USER_TRANSFER',
    currency: 0,
    sum: '',
    pin: '',
    type: 'INNER_VOUCHER',
    recipient: ''
  };

  constructor(
    public balanceService: BalanceService,
    public popupService: PopupService,
    protected store: Store<State>,
  ) {
    super();
  }

  ngOnInit() {
    this.responseCommission = this.responseDefaultCommission;
    this.initForm();
    this.getCommissionDebonce();
    this.getAllNames();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  submitTransfer() {
    this.isSubmited = true;
    this.form.get('amount').updateValueAndValidity()
      if (this.form.valid) {
        this.isEnterData = false;
      }
  }

  afterResolvedCaptcha(event) {
    this.model.recipient = this.form.controls['email'].value;
    this.model.currency = this.activeCrypto ? this.activeCrypto.id : null;
    this.model.sum = this.form.controls['amount'].value;
    const data = {
      operation: BY_PRIVATE_CODE,
      data: this.model
    };

    this.balanceService.goToPinCode$.next(data);
  }

  private initForm() {
    this.form = new FormGroup({
      email: new FormControl('', {validators: [Validators.required, Validators.pattern(this.emailRegex)]}),
      amount: new FormControl('', {validators: [
        Validators.required,
          this.isMaxThenActiveBalance.bind(this),
          this.isMinThenMinWithdraw.bind(this)
        ]}),
    });
  }
}
