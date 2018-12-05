import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BalanceService} from '../../../balance.service';

@Component({
  selector: 'app-refill-inner-transfer',
  templateUrl: './refill-inner-transfer.component.html',
  styleUrls: ['./refill-inner-transfer.component.scss']
})
export class RefillInnerTransferComponent implements OnInit {

  public form: FormGroup;
  public isSendTransferCodeSuccess = false;
  public isSendTransferCodeFail = false;

  constructor(
    private balanceService: BalanceService,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      code: new FormControl('', [Validators.required] ),
    });
  }

  sendTransferCode() {
    if (this.form.valid) {
      const data = this.form.controls['code'].value;
      this.form.reset();
      this.balanceService.sendTransferCode(data).subscribe(res => {
        this.isSendTransferCodeSuccess = true;
        console.log(res['status']);
      }, error => {
        const status = error['status'];
        console.log('status: ' + status);
        this.isSendTransferCodeFail = true;
      });
    }
  }
}
