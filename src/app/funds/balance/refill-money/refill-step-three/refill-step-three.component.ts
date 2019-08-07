import { Component, OnInit } from '@angular/core';
import { BalanceService } from 'app/funds/services/balance.service';
import { first, takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import * as fromCore from '../../../../core/reducers';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-refill-step-three',
  templateUrl: './refill-step-three.component.html',
  styleUrls: ['./refill-step-three.component.scss'],
})
export class RefillStepThreeComponent implements OnInit {
  form: FormGroup;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  googleAuthenticator: any;
  statusMessage = '';
  twoFaTitle = '';
  isError = false;

  constructor(
    public balanceService: BalanceService,
    private store: Store<fromCore.State>,
    public translateService: TranslateService
  ) {
    balanceService
      .getRefillTransfer()
      .pipe(first())
      .subscribe((data: any) => {
        this.sendRefillBalance = data;
      });
  }

  sendRefillBalance: any;

  ngOnInit() {
    this.initForm();
    this.store
      .pipe(select(fromCore.getGAStatus))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((GA: any) => {
        // console.log(GA);
        this.googleAuthenticator = GA;
        if (this.googleAuthenticator) {
          this.twoFaTitle = this.translateService.instant('Use Google Authenticator to generate pincode');
        } else {
          this.twoFaTitle = this.translateService.instant(
            'Please enter two-factor authentication code that was sent to your email'
          );
        }
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
          },
          error => {
            this.setStatusMessage(error);
          }
        );
    }
  }

  get currentCode(): any {
    return this.form.get('code');
  }

  setStatusMessage(err) {
    if (err['status'] === 400 && err.error.cause === 'IncorrectPinException') {
      this.form.reset();
      this.isError = true;
      if (this.googleAuthenticator) {
        this.twoFaTitle = this.translateService.instant(
          'Code is wrong! Please, check you code in Google Authenticator application.'
        );
      } else {
        this.twoFaTitle = this.translateService.instant('Code is wrong! New code was sent to your email.');
      }
    } else if (err['status'] === 400 && err.error.cause === 'RequestLimitExceededException') {
      this.isError = true;
      this.twoFaTitle = this.translateService.instant(err.error.details);
    } else {
      console.error(err);
    }
  }
}
