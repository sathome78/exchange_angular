import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BalanceService} from '../../../../services/balance.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {BY_PRIVATE_CODE, SEND_CRYPTO, SEND_FIAT, TRANSFER_INSTANT} from '../../send-money-constants';

@Component({
  selector: 'app-send-tfa',
  templateUrl: './send-tfa.component.html',
  styleUrls: ['./send-tfa.component.scss']
})
export class SendTfaComponent implements OnInit, OnDestroy {

  @Input() data;
  @Output() sendSuccess = new EventEmitter();
  public form: FormGroup;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public message = '';
  public subtitleMessage = '';
  public isSentPin: boolean;
  public pincodeTries = 0;

  constructor(
    public balanceService: BalanceService
  ) {
  }

  ngOnInit() {

    this.balanceService.sendPinCode()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.isSentPin = res.status === 201 ? true : false;
        this.subtitleMessage = this.isSentPin ? '' : 'Put the code';
      });

    this.form = new FormGroup({
      pin: new FormControl('', [Validators.required]),
    });
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
    this.pincodeTries++;
    this.data.data.tries = this.pincodeTries;
    this.data.data.securityCode = this.form.controls['pin'].value;
    this.balanceService.withdrawRequest(this.data.data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        const data = {
          operation: this.data.operation,
          successData: res
        };
        this.balanceService.goToSendMoneySuccess$.next(data);
      }, error => {
        this.catchStatus(error['status']);
      });
  }

  sendTransferInstant() {
    this.pincodeTries++;
    this.data.data.tries = this.pincodeTries;
    this.data.data.pin = this.form.controls['pin'].value;
    this.balanceService.createTransferInstant(this.data.data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        const data = {
          operation: this.data.operation,
          successData: res
        };
        this.balanceService.goToSendMoneySuccess$.next(data);
      }, error => {
        this.catchStatus(error['status']);
      });
  }

  private catchStatus(status: number) {
    switch (status) {
      case 500:
        this.message = 'Server error';
        break;
      case 418:
        this.form.controls['pin'].patchValue('');
        if (this.pincodeTries === 3) {
          this.pincodeTries = 0;
          this.subtitleMessage = this.isSentPin ?
            'Code is wrong! Please, check you code in Google Authenticator application.' :
            'Code is wrong! New code was sent to your email.';
        } else {
          this.data.data.tries = this.pincodeTries;
          this.subtitleMessage = 'Code is wrong!';
        }
        break;
    }
  }
}
