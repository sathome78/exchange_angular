import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BalanceService} from '../../../../services/balance.service';

@Component({
  selector: 'app-send-tfa',
  templateUrl: './send-tfa.component.html',
  styleUrls: ['./send-tfa.component.scss']
})
export class SendTfaComponent implements OnInit {

  @Input() data;
  public form: FormGroup;
  @Output() sendSuccess = new EventEmitter();
  public message = '';
  constructor(
    public balanceService: BalanceService
  ) {
  }

  ngOnInit() {
    console.log(this.data);
    this.form = new FormGroup({
      pin: new FormControl('', [Validators.required]),
    });
  }


  onSubmit() {
    /** mock */
    // const data1 = {
    //   operationName: this.data.operation,
    //   successData: {}
    // };
    // console.log(this.form)
    // console.log(this.data)
    // this.balanceService.goToSendMoneySuccess$.next(data1)
    /** --------------------*/
    if (this.form.valid) {
      this.chooseSubmitMethod(this.data.operation);
    }
  }

  chooseSubmitMethod(operation: string) {
    switch (operation) {
      case 'Send Fiat':
      case 'Send Crypto':
        this.sendWithdaraw();
        break;
      case 'Transfer Instant':
      case 'By private code':
        this.sendTransferInstant();
        break;
    }

  }

  sendWithdaraw() {
    this.data.data.securityCode = this.form.controls['pin'].value;
    console.log(this.data);
    this.balanceService.withdrawRequest(this.data.data).subscribe(res => {
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
    /** mock **/
    // const data1 = {
    //   operation: this.data.operation,
    //   successData: {}
    // };
    // console.log(this.data);
    // this.balanceService.goToSendMoneySuccess$.next(data1);
    /** ------------ **/
    this.balanceService.createTransferInstant(this.data.data).subscribe(res => {
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
