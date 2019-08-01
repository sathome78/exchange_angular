import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BalanceService} from '../../../../services/balance.service';
import {State, getUserInfo} from '../../../../../core/reducers';
import {Store, select} from '@ngrx/store';
import {BY_PRIVATE_CODE} from '../../send-money-constants';
import {AbstractTransfer} from '../abstract-transfer';
import {PopupService} from '../../../../../shared/services/popup.service';
import {UtilsService} from 'app/shared/services/utils.service';
import {takeUntil} from 'rxjs/operators';

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
    currencyName: '',
    type: 'VOUCHER'
  };
  public userInfo: ParsedToken;

  constructor(
    public balanceService: BalanceService,
    public popupService: PopupService,
    protected store: Store<State>,
    public utilsService: UtilsService,
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
    this.responseCommission = this.responseDefaultCommission;
    this.getAllNames();
    this.store.pipe(select(getUserInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userInfo: ParsedToken) => {
        this.userInfo = userInfo;
      });
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

  afterResolvedCaptcha() {
    this.model.currency = this.activeCrypto.id;
    this.model.sum = this.form.controls['amount'].value;
    this.model.currencyName = this.activeCrypto.name;
    const data = {
      operation: BY_PRIVATE_CODE,
      data: this.model
    };
    this.balanceService.goToPinCode$.next(data);
  }

  private initForm() {
    this.form = new FormGroup({
      amount: new FormControl('', {validators: [
          Validators.required,
          this.isMaxThenActiveBalance.bind(this),
          this.isMinThenMinWithdraw.bind(this)
        ]}),
    });
  }

  trackByAlphabet(index, item) {
    return item;
  }

  trackByCryptoNames(index, item) {
    return item.id;
  }
}
