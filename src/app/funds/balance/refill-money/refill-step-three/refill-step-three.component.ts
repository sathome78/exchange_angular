import { Component, OnInit } from '@angular/core';
import { BalanceService } from 'app/funds/services/balance.service';
import { first, takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import * as fromCore from '../../../../core/reducers';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-refill-step-three',
  templateUrl: './refill-step-three.component.html',
  styleUrls: ['./refill-step-three.component.scss'],
})
export class RefillStepThreeComponent implements OnInit {
  form: FormGroup;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  googleAuthenticator: any;
  statusMessage: string = '';

  constructor(public balanceService: BalanceService, private store: Store<fromCore.State>) {
    balanceService
      .getRefillTransfer()
      .pipe(first())
      .subscribe((data: any) => {
        this.sendRefillBalance = data;
        console.log(this.sendRefillBalance);
      });
  }

  sendRefillBalance: any;

  ngOnInit() {
    this.initForm();
    this.store
      .pipe(select(fromCore.getGAStatus))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((GA: any) => {
        console.log(GA);
        this.googleAuthenticator = GA;
      });
  }

  initForm() {
    this.form = new FormGroup({
      code: new FormControl('', Validators.required),
    });
  }

  submit(form) {
    if (form.valid) {
      this.sendRefillBalance.securityCode = `${form.value.code}`;

      this.balanceService
        .withdrawRequest(this.sendRefillBalance)
        .pipe(first())
        .subscribe(
          (data: any) => {
            console.log(data);
          },
          error => {
            this.setStatusMessage(error);
            console.log(error);
          }
        );
    }
  }

  get currentCode(): any {
    return this.form.get('code');
  }

  setStatusMessage(err) {
    if (err['status'] === 400) {
      this.form.reset();
      this.statusMessage = 'Wrong code';
    }
  }
}
