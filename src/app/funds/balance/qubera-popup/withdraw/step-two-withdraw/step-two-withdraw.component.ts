import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BalanceService } from 'app/funds/services/balance.service';
import { first, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as fromCore from '../../../../../core/reducers';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-step-two-withdraw',
  templateUrl: './step-two-withdraw.component.html',
  styleUrls: ['./step-two-withdraw.component.scss']
})
export class StepTwoWithdrawComponent implements OnInit {

  form: FormGroup;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Output() public nextStep: EventEmitter<any> = new EventEmitter();

  payments: any;
  googleAuthenticator: any;
  statusMessage: string = '';

  constructor(
    public balanceService: BalanceService,
    private store: Store<fromCore.State>) {
      balanceService.getWithdrawQubera()
        .pipe(first())
        .subscribe((data: any) => {
          this.payments = data;
        })
    }

  ngOnInit() {
    this.initForm();
    this.store.pipe(select(fromCore.getGAStatus))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((GA: any) => {
        console.log(GA);
        this.googleAuthenticator = GA;
      });
  }

  initForm() {
    this.form = new FormGroup({
      code: new FormControl('', Validators.required)
    });
  }

  get currentCode(): any {
    return this.form.get('code');
  }

  enterCode(form) {
      const obj: Object = {
        pin: `${form.code}`,
        paymentId: this.payments.id
      };
      this.balanceService.confirmSendWithdraw(obj)
        .pipe(first())
        .subscribe((data: any) => {
          this.nextStep.emit(3);
        });
  }

  setStatusMessage(err) {
    if (err['status'] === 400) {
        this.form.reset();
        this.statusMessage = "Wrong code";
    }
  }
}
