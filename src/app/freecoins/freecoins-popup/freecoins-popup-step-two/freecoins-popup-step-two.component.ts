import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { State, getGAStatus } from 'app/core/reducers';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-freecoins-popup-step-two',
  templateUrl: './freecoins-popup-step-two.component.html',
  styleUrls: ['./freecoins-popup-step-two.component.scss'],
})
export class FreecoinsPopupStepTwoComponent implements OnInit, OnDestroy {
  @Output() nextStep = new EventEmitter<number>();
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public googleAuthenticator;
  public twoFaTitle: string;
  public form: FormGroup;
  public statusMessage = '';
  public isError = false;

  constructor(
    private store: Store<State>,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.store
      .pipe(select(getGAStatus))
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initForm() {
    this.form = new FormGroup({
      code: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.nextStep.emit(3);
    // if (form.valid) {
    //   // this.balanceService
    //   //   .refill(this.sendRefillBalance)
    //   //   .pipe(first())
    //   //   .subscribe(
    //   //     (data: any) => {
    //   //     },
    //   //     error => {
    //   //       this.setStatusMessage(error);
    //   //     }
    //   //   );

    // }
  }

  // setStatusMessage(err) {
  //   if (err['status'] === 400 && err.error.cause === 'IncorrectPinException') {
  //     this.form.reset();
  //     this.isError = true;
  //     if (this.googleAuthenticator) {
  //       this.twoFaTitle = this.translateService.instant(
  //         'Code is wrong! Please, check you code in Google Authenticator application.'
  //       );
  //     } else {
  //       this.twoFaTitle = this.translateService.instant('Code is wrong! New code was sent to your email.');
  //     }
  //   } else if (err['status'] === 400 && err.error.cause === 'RequestLimitExceededException') {
  //     this.isError = true;
  //     this.twoFaTitle = this.translateService.instant(err.error.details);
  //   } else {
  //     console.error(err);
  //   }
  // }

  // form getter
  get formPin() {
    return this.form.controls['code'];
  }
}
