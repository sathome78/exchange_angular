import { Component, OnInit, TemplateRef, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { PopupService } from '../../shared/services/popup.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenHolder } from '../../model/token-holder.model';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoggingService } from '../../shared/services/logging.service';
import { keys, AUTH_MESSAGES } from '../../shared/constants';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from 'app/shared/services/utils.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import * as fromCore from '../../core/reducers';
import * as coreActions from '../../core/actions/core.actions';
import { Location } from '@angular/common';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { GtagService } from '../../shared/services/gtag.service';

@Component({
  selector: 'app-login-popup-mobile',
  templateUrl: './login-popup-mobile.component.html',
  styleUrls: ['./login-popup-mobile.component.scss'],
})
export class LoginPopupMobileComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public recaptchaKey = keys.recaptchaKey;
  public isPasswordVisible = false;
  public twoFaAuthModeMessage = 'Please enter two-factor authentication code that was sent to your email';
  public pincodeAttempts = 0;
  public isError = false;
  public statusMessage = '';
  public inPineCodeMode;
  public isGA = false;
  public isGACheck = false;
  public currencyPair: SimpleCurrencyPair;
  public afterCaptchaMessage;
  public loading = false;

  public currentTemplate: TemplateRef<any>;
  @ViewChild('logInTemplate') public logInTemplate: TemplateRef<any>;
  @ViewChild('pinCodeTemplate') public pinCodeTemplate: TemplateRef<any>;
  @ViewChild('captchaTemplate') public captchaTemplate: TemplateRef<any>;
  @ViewChild('devCaptchaTemplate') public devCaptchaTemplate: TemplateRef<any>;
  @ViewChild('pinInput') public pinInput: ElementRef<any>;
  public loginForm: FormGroup;
  public pinForm: FormGroup;
  public isPinEmpty;
  public showSendAgainBtn = false;

  private email;
  private password;
  private pin;

  constructor(
    private popupService: PopupService,
    private userService: UserService,
    private logger: LoggingService,
    private authService: AuthService,
    private translateService: TranslateService,
    private utilsService: UtilsService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private store: Store<fromCore.State>,
    private gtagService: GtagService
  ) {}

  ngOnInit() {
    this.setTemplate('logInTemplate');
    this.initForm();

    this.route.url.pipe(takeUntil(this.ngUnsubscribe)).subscribe(segments => {
      const url = segments.map(u => u.path).join('/');
      setTimeout(() => {
        // added to fix ExpressionChangedAfterItHasBeenCheckedError
        if (url === 'registration') {
          this.popupService.showMobileRegistrationPopup(true);
        }
        if (url === 'login') {
          this.popupService.showMobileLoginPopup(true);
        }
      });
    });

    this.store
      .pipe(select(fromCore.getActiveCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: SimpleCurrencyPair) => {
        this.currencyPair = pair;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, this.utilsService.emailValidator()],
      }),
      password: new FormControl('', {
        validators: [Validators.required, this.utilsService.passwordCombinationValidator()],
      }),
    });
    this.pinForm = new FormGroup({
      pin: new FormControl('', { validators: Validators.required }),
    });
    this.inPineCodeMode = false;
  }

  setTemplate(template: string) {
    switch (template) {
      case 'logInTemplate':
        this.currentTemplate = this.logInTemplate;
        break;
      case 'pinCodeTemplate':
        this.currentTemplate = this.pinCodeTemplate;
        setTimeout(() => this.pinInput.nativeElement.focus(), 500);
        break;
      case 'captchaTemplate':
        this.currentTemplate = this.captchaTemplate;
        break;
      case 'devCaptchaTemplate':
        this.currentTemplate = this.devCaptchaTemplate;
        break;
    }
  }

  closeMe() {
    this.popupService.closeMobileLoginPopup();
    this.location.replaceState('dashboard');
  }

  openRegistration() {
    this.popupService.showMobileRegistrationPopup(true);
    this.closeMe();
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  checkGoogleLoginEnabled(email: string): void {
    this.userService
      .getUserGoogleLoginEnabled(email)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        result => {
          this.isGACheck = true;
          if (result) {
            this.isGA = true;
            this.twoFaAuthModeMessage = this.translateService.instant('Use Google Authenticator to generate pincode');
          }
        },
        err => console.error(err)
      );
  }

  setStatusMessage(err) {
    this.showSendAgainBtn = false;
    if (err['status'] === 400) {
      if (!this.isGACheck) {
        this.checkGoogleLoginEnabled(this.email);
      }
      if (
        err.error.title === 'REQUIRED_EMAIL_AUTHORIZATION_CODE' ||
        err.error.title === 'REQUIRED_GOOGLE_AUTHORIZATION_CODE' ||
        err.error.title === 'EMAIL_AUTHORIZATION_FAILED' ||
        err.error.title === 'GOOGLE_AUTHORIZATION_FAILED'
      ) {
        this.inPineCodeMode = true;
        this.setTemplate('pinCodeTemplate');
        this.pinForm.reset();
        if (this.pincodeAttempts > 0) {
          this.isError = true;
          this.twoFaAuthModeMessage =
            this.pincodeAttempts === 3
              ? this.isGA
                ? this.translateService.instant(
                    'Code is wrong! Please, check you code in Google Authenticator application.'
                  )
                : this.translateService.instant('Code is wrong! New code was sent to your email.')
              : this.translateService.instant('Code is wrong!');
          this.pincodeAttempts = this.pincodeAttempts === 3 ? 0 : this.pincodeAttempts;
          this.pinForm.get('pin').patchValue('');
        } else {
          this.statusMessage = this.translateService.instant('Pin code is required!');
        }
      } else {
        this.statusMessage = !AUTH_MESSAGES[err.error.title] ? '' : AUTH_MESSAGES[err.error.title];
      }
    } else {
      this.statusMessage = AUTH_MESSAGES.OTHER_HTTP_ERROR;
    }
  }

  onSubmit() {
    const email = this.loginForm.get('email').value;
    if (this.utilsService.isDevCaptcha(email)) {
      this.setTemplate('devCaptchaTemplate');
      return;
    }
    this.setTemplate('captchaTemplate');
  }

  afterResolvedCaptcha(event) {
    // this.setTemplate('logInTemplate');
    if (this.loginForm.valid) {
      this.email = this.loginForm.get('email').value.trim();
      this.password = this.loginForm.get('password').value;
      if (this.inPineCodeMode) {
        this.pin = this.pinForm.get('pin').value;
        this.pincodeAttempts += 1;
      }
      if (this.inPineCodeMode && !this.pin) {
        return;
      }
      this.sendToServer();
    }
  }

  sendToServer() {

    this.logger.debug(this, `attempt to authenticate with email: ${this.email} and password: ${this.password}`);
    this.loading = true;
    this.userService
      .authenticateUser(this.email, this.password, this.pin, this.pincodeAttempts)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (tokenHolder: TokenHolder) => {
          this.logger.debug(
            this,
            `User { login: ${this.email}, pass: ${this.password}} signed in and obtained ${tokenHolder}`
          );
          this.authService.setToken(tokenHolder.token);
          const parsedToken = this.authService.parseToken();
          this.gtagService.setUserId(parsedToken.publicId);
          this.gtagService.sendLoginSuccessGtag();
          this.store.dispatch(new coreActions.SetOnLoginAction(parsedToken));
          this.popupService.closeMobileLoginPopup();
          this.userService.getUserBalance(this.currencyPair);
          this.loading = false;
        },
        err => {
          // console.error(err, 'sendToServerError');
          const status = err['status'];
          this.setTemplate('logInTemplate');
          this.setStatusMessage(err);
          this.loading = false;
        }
      );
  }

  getInputType(): string {
    return this.isPasswordVisible ? 'text' : 'password';
  }

  openRecoveryPasswordPopup() {
    this.closeMe();
    this.popupService.showRecoveryPasswordPopup(true);
  }

  emailInput() {
    this.statusMessage = '';
  }

  sendAgain() {}
}
