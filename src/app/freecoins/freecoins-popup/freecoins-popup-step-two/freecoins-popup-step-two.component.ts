import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { State, getGAStatus } from 'app/core/reducers';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FreecoinsService } from 'app/freecoins/freecoins.service';
import { GAFreeCoinsReqModel } from 'app/freecoins/models/GAFreeCoins.model';

@Component({
  selector: 'app-freecoins-popup-step-two',
  templateUrl: './freecoins-popup-step-two.component.html',
  styleUrls: ['./freecoins-popup-step-two.component.scss'],
})
export class FreecoinsPopupStepTwoComponent implements OnInit, OnDestroy {
  @Output() public nextStep = new EventEmitter<number>();
  @Input() public formData: GAFreeCoinsReqModel;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public googleAuthenticator;
  public twoFaTitle: string;
  public form: FormGroup;
  public statusMessage = '';
  public isError = false;
  public loading = false;

  constructor(
    private store: Store<State>,
    private translateService: TranslateService,
    private freecoinsService: FreecoinsService
  ) { }

  ngOnInit() {
    this.initForm();
    this.store
      .pipe(select(getGAStatus))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((GA: any) => {
        this.googleAuthenticator = GA;
        if (this.googleAuthenticator) {
          this.twoFaTitle = this.translateService.instant('Use Google Authenticator to generate pincode');
        } else {
          this.sendPin();
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

  sendPin() {
    this.freecoinsService.sendPin()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {});
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.formData.pin = this.formPin.value;
      this.freecoinsService.giveAwayCurrency(this.formData)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.nextStep.emit(3);
          this.loading = false;
        }, error => {
          this.setStatusMessage(error);
          this.loading = false;
        });
    }
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

  // form getter
  get formPin() {
    return this.form.controls['code'];
  }
}
