import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BalanceService} from '../../../../../shared/services/balance.service';

@Component({
  selector: 'app-send-tfa',
  templateUrl: './send-tfa.component.html',
  styleUrls: ['./send-tfa.component.scss']
})
export class SendTfaComponent implements OnInit {

  @Input() data;
  public form: FormGroup;
  @Output() sendSuccess = new EventEmitter();

  constructor(
    public balanceService: BalanceService
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.form = new FormGroup({
      pin: new FormControl('', [Validators.required] ),
    });
  }




  onSubmit() {
    // /** mock */
    // const data1 = {
    //   operationName: 'Send Crypto',
    //   successData: {}
    // };
    // console.log(this.form)
    // this.balanceService.goToSendMoneySuccess$.next(data1)
    // /** --------------------*/
    if (this.form.valid) {
      this.data.data.securityCode = this.form.controls['pin'].value;
      console.log(this.data)
      this.balanceService.withdrawRequest(this.data.data).subscribe( res => {
       const data = {
         operationName: 'Send Crypto',
         successData: res
       }
        this.balanceService.goToSendMoneySuccess$.next(data);
      });
    }
  }

}
