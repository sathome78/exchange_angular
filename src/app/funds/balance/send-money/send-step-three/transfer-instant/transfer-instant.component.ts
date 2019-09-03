import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BalanceService } from '../../../../services/balance.service';
import { Store, select } from '@ngrx/store';
import { State, getUserInfo } from '../../../../../core/reducers';
import { TRANSFER_INSTANT } from '../../send-money-constants';
import { AbstractTransfer } from '../abstract-transfer';
import { PopupService } from '../../../../../shared/services/popup.service';
import { UtilsService } from '../../../../../shared/services/utils.service';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-transfer-instant',
  templateUrl: './transfer-instant.component.html',
  styleUrls: ['./transfer-instant.component.scss'],
})
export class TransferInstantComponent extends AbstractTransfer implements OnInit, OnDestroy {
  public userInfo: ParsedToken;
  constructor(
    public balanceService: BalanceService,
    public popupService: PopupService,
    public utilsService: UtilsService,
    protected store: Store<State>
  ) {
    super();
  }

  public model = {
    operationType: 'USER_TRANSFER',
    currency: 0,
    sum: '',
    pin: '',
    currencyName: '',
    type: 'TRANSFER',
    recipient: '',
  };

  ngOnInit() {
    this.responseCommission = this.responseDefaultCommission;
    this.initForm();
    this.getAllNames();
    this.store
      .pipe(select(getUserInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userInfo: ParsedToken) => {
        this.userInfo = userInfo;
      });
  }

  submitTransfer() {
    this.formAmount.updateValueAndValidity();
    this.isSubmited = true;
    if (this.form.valid) {
      this.isEnterData = false;
    }
  }

  afterResolvedCaptcha(event) {
    this.model.recipient = this.formEmail.value;
    this.model.currency = this.activeCrypto ? this.activeCrypto.id : null;
    this.model.sum = this.formAmount.value;
    this.model.currencyName = this.activeCrypto.name;
    const data = {
      operation: TRANSFER_INSTANT,
      data: this.model,
    };
    this.balanceService.goToPinCode$.next(data);
  }

  private initForm() {
    this.form = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, this.utilsService.emailValidator()],
      }),
      amount: new FormControl('', {
        validators: [
          Validators.required,
          this.isMaxThenActiveBalance.bind(this),
          this.isMinThenMinWithdraw.bind(this),
        ],
      }),
    });

    this.formEmail.valueChanges
      .pipe(tap(() => (this.pendingCheckEmail = true)))
      .pipe(debounceTime(1000))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => this.checkEmailOfServer());
  }
}
