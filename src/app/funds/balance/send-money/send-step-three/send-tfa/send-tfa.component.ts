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
  public isSentPin: boolean;

  constructor(
    public balanceService: BalanceService
  ) {
  }

  ngOnInit() {
    this.balanceService.sendPinCode()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: Response) => {
        this.isSentPin = res.status === 201 ? true : false;
      });
    this.form = new FormGroup({
      pin: new FormControl('', [Validators.required]),
    });
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
        this.message = 'Server error';
      });
  }

  sendTransferInstant() {
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
        this.message = 'Server error';
      });
  }

}
