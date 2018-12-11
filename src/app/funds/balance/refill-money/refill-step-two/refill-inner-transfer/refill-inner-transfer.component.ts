import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BalanceService} from '../../../../services/balance.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-refill-inner-transfer',
  templateUrl: './refill-inner-transfer.component.html',
  styleUrls: ['./refill-inner-transfer.component.scss']
})
export class RefillInnerTransferComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public isSendTransferCodeSuccess = false;
  public isSendTransferCodeFail = false;

  constructor(
    private balanceService: BalanceService,
  ) { }

  ngOnInit() {
    this.initForm();
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
      this.balanceService.sendTransferCode(data)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
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
