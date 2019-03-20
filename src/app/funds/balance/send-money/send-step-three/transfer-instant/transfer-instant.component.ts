import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BalanceService} from '../../../../services/balance.service';
import {Store} from '@ngrx/store';
import {State} from '../../../../../core/reducers';
import {TRANSFER_INSTANT} from '../../send-money-constants';
import {AbstractTransfer} from '../abstract-transfer';
import {PopupService} from '../../../../../shared/services/popup.service';
import {UtilsService} from '../../../../../shared/services/utils.service';

@Component({
  selector: 'app-transfer-instant',
  templateUrl: './transfer-instant.component.html',
  styleUrls: ['./transfer-instant.component.scss']
})
export class TransferInstantComponent extends AbstractTransfer implements OnInit, OnDestroy {

  constructor(
    public balanceService: BalanceService,
    public popupService: PopupService,
    private utilsService: UtilsService,
    protected store: Store<State>,
  ) {
    super();
  }

  public model = {
    operationType: 'USER_TRANSFER',
    currency: 0,
    sum: '',
    pin: '',
    type: 'TRANSFER',
    recipient: ''
  };

  ngOnInit() {
    this.responseCommission = this.responseDefaultCommission;
    this.initForm();
    this.getAllNames();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  submitTransfer() {
    this.form.get('amount').updateValueAndValidity();
    this.isSubmited = true;
    if (this.form.valid) {
      this.isEnterData = false;
    }
  }

  afterResolvedCaptcha(event) {
    this.model.recipient = this.form.controls['email'].value;
    this.model.currency = this.activeCrypto ? this.activeCrypto.id : null;
    this.model.sum = this.form.controls['amount'].value;
    const data = {
      operation: TRANSFER_INSTANT,
      data: this.model
    };

    this.balanceService.goToPinCode$.next(data);
  }

  private initForm() {
    this.form = new FormGroup({
      email: new FormControl('', {validators: [Validators.required, this.utilsService.emailValidator()]}),
      amount: new FormControl('', {validators: [
          Validators.required,
          this.isMaxThenActiveBalance.bind(this),
          this.isMinThenMinWithdraw.bind(this)
        ]}),
    });
  }
}
