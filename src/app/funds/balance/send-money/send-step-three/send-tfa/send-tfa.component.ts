import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BalanceService } from '../../../../services/balance.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  BY_PRIVATE_CODE,
  CODE_FROM_EMAIL,
  CODE_FROM_GOOGLE,
  SEND_CRYPTO,
  SEND_FIAT,
  TRANSFER_INSTANT
} from '../../send-money-constants';
import { TranslateService } from '@ngx-translate/core';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-send-tfa',
  templateUrl: './send-tfa.component.html',
  styleUrls: ['./send-tfa.component.scss'],
})
export class SendTfaComponent implements OnInit, OnDestroy {
  @Input() data;
  @Output() sendSuccess = new EventEmitter();
  public form: FormGroup;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public message = '';
  public subtitleMessage = '';
  public pincodeFrom = '';
  public pincodeTries = 0;
  public loading = false;

  public CODE_FROM_EMAIL = CODE_FROM_EMAIL;
  public CODE_FROM_GOOGLE = CODE_FROM_GOOGLE;

  constructor(public balanceService: BalanceService, private translateService: TranslateService) {}

  ngOnInit() {
    this.form = new FormGroup({
      pin: new FormControl('', [Validators.required]),
    });
    this.choosePinMethod(this.data.operation);
    this.data.data.tries = this.pincodeTries;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    if (this.form.valid) {
      this.chooseSubmitMethod(this.data.operation);
    }
  }

  choosePinMethod(operation: string) {
    const pinData = {
      amount: this.data.data.sum || 0,
      currencyName: this.data.data.currencyName,
    };
    switch (operation) {
      case SEND_FIAT:
      case SEND_CRYPTO:
        this.sendWithdrawalPin(pinData);
        break;
      case TRANSFER_INSTANT:
      case BY_PRIVATE_CODE:
        this.sendTransferPin(pinData);
        break;
    }
  }

  sendWithdrawalPin(pinData) {
    this.balanceService
      .sendWithdrawalPinCode(pinData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: HttpResponse<any>) => {
        this.pincodeFrom = res.status === 201 ? CODE_FROM_EMAIL : CODE_FROM_GOOGLE;
        this.subtitleMessage = this.pincodeFrom ? '' : this.translateService.instant('Put the code');
      });
  }

  sendTransferPin(pinData) {
    this.balanceService
      .sendTransferPinCode(pinData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: HttpResponse<any>) => {
        this.pincodeFrom = res.status === 201 ? CODE_FROM_EMAIL : CODE_FROM_GOOGLE;
        this.subtitleMessage = this.pincodeFrom ? '' : this.translateService.instant('Put the code');
      });
  }

  chooseSubmitMethod(operation: string) {
    switch (operation) {
      case SEND_FIAT:
      case SEND_CRYPTO:
        this.sendWithdaraw();
        break;
      case TRANSFER_INSTANT:
      case BY_PRIVATE_CODE:
        this.sendTransferInstant();
        break;
    }
  }

  sendWithdaraw() {
    this.pincodeTries += 1;
    this.data.data.tries = this.pincodeTries;
    this.data.data.securityCode = this.form.controls['pin'].value;
    this.loading = true;
    this.balanceService
      .withdrawRequest(this.data.data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        res => {
          const data = {
            operation: this.data.operation,
            successData: res,
          };
          this.balanceService.goToSendMoneySuccess$.next(data);
          this.loading = false;
        },
        error => {
          this.catchStatus(error['status']);
          this.loading = false;
        }
      );
  }

  sendTransferInstant() {
    this.pincodeTries += 1;
    this.data.data.tries = this.pincodeTries;
    this.data.data.pin = this.form.controls['pin'].value;
    this.loading = true;
    this.balanceService
      .createTransferInstant(this.data.data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        res => {
          const data = {
            operation: this.data.operation,
            successData: res,
          };
          this.balanceService.goToSendMoneySuccess$.next(data);
          this.loading = false;
        },
        error => {
          this.catchStatus(error['status']);
          this.loading = false;
        }
      );
  }

  private catchStatus(status: number) {
    switch (status) {
      case 500:
        this.message = 'Server error';
        break;
      case 400:
        this.form.controls['pin'].patchValue('');
        if (this.pincodeTries === 3) {
          this.pincodeTries = 0;
          this.subtitleMessage =
            this.pincodeFrom === CODE_FROM_GOOGLE
              ? this.translateService.instant(
                  'Code is wrong! Please, check you code in Google Authenticator application.'
                )
              : this.translateService.instant('Code is wrong! New code was sent to your email.');
        } else {
          this.data.data.tries = this.pincodeTries;
          this.subtitleMessage = this.translateService.instant('Code is wrong!');
        }
        break;
    }
  }
}
