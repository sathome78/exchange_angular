import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BalanceService} from '../../../../services/balance.service';
import {State} from '../../../../../core/reducers';
import {Store} from '@ngrx/store';
import {BY_PRIVATE_CODE} from '../../send-money-constants';
import {AbstractTransfer} from '../abstract-transfer';
import {environment} from '../../../../../../environments/environment';
import {PopupService} from '../../../../../shared/services/popup.service';

@Component({
  selector: 'app-transfer-protected-code',
  templateUrl: './transfer-protected-code.component.html',
  styleUrls: ['./transfer-protected-code.component.scss']
})
export class TransferProtectedCodeComponent extends AbstractTransfer implements OnInit, OnDestroy {

  public model = {
    operationType: 'USER_TRANSFER',
    currency: 0,
    sum: '',
    pin: '',
    type: 'VOUCHER'
  };

  constructor(
    public balanceService: BalanceService,
    public popupService: PopupService,
    protected store: Store<State>,
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
    this.responseCommission = this.responseDefaultCommission;
    this.getCommissionDebonce();
    this.getAllNames();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  submitTransfer() {
    this.isSubmited = true;
    if (environment.production) {
      // todo while insecure
      this.popupService.showDemoTradingPopup(true);
      this.balanceService.closeSendMoneyPopup$.next(false);
    } else {
      if (!this.isAmountMax && !this.isAmountMin && this.form.controls['amount'].value !== '0') {
        this.isSubmited = false;
        this.isEnterData = false;
      }
    }

  }

  afterResolvedCaptcha() {
    this.model.currency = this.activeCrypto.id;
    this.model.sum = this.form.controls['amount'].value;
    const data = {
      operation: BY_PRIVATE_CODE,
      data: this.model
    };
    this.balanceService.goToPinCode$.next(data);
  }

  private initForm() {
    this.form = new FormGroup({
      amount: new FormControl('0', {validators: [Validators.required]}),
    });
  }
}
