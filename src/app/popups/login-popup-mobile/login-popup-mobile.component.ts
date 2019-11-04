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
import { Subject, Observable } from 'rxjs';
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
  public twoFaAuthModeMessage = '';
  public pincodeAttempts = 0;
  public isError = false;
  public statusMessage = '';
  public inPineCodeMode;
  public is2faEnabled$: Observable<boolean>;
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
    this.is2faEnabled$ = this.store
      .pipe(select(fromCore.getIs2faEnabled))
      .pipe(takeUntil(this.ngUnsubscribe));
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
    this.store.dispatch(new coreActions.Set2faStatusAction(null));
  }

  openRegistration() {
    this.popupService.showMobileRegistrationPopup(true);
    this.closeMe();
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  setStatusMessage(err, is2fa) {
    this.showSendAgainBtn = false;
    if (err['status'] === 400) {

      if (
        err.error.title === 'REQUIRED_EMAIL_AUTHORIZATION_CODE' ||
        err.error.title === 'REQUIRED_GOOGLE_AUTHORIZATION_CODE' ||
        err.error.title === 'EMAIL_AUTHORIZATION_FAILED' ||
        err.error.title === 'GOOGLE_AUTHORIZATION_FAILED'
      ) {
        this.inPineCodeMode = true;
        this.setTemplate('pinCodeTemplate');
        if (this.pincodeAttempts > 0) {
          this.isError = true;
          if (this.pincodeAttempts === 3) {
            if (is2fa) {
              this.twoFaAuthModeMessage = this.translateService.instant(
                'Code is wrong! Please, check you code in Google Authenticator application.'
              );
            }
          } else {
            this.twoFaAuthModeMessage = this.translateService.instant('Code is wrong!');
          }
        } else {
          if (is2fa) {
            this.twoFaAuthModeMessage = this.translateService.instant(
              'Use Google Authenticator to generate pincode.'
            );
          } else {
            this.twoFaAuthModeMessage = this.translateService.instant(
              'Please enter two-factor authentication code that was sent to your email.'
            );
          }
        }
        this.pincodeAttempts = this.pincodeAttempts === 3 ? 0 : this.pincodeAttempts;
        this.pinFormCode.setValue('');
        this.pinFormCode.setErrors({ pinError: true });
      } else if (err.error.title === 'EMAIL_AUTHORIZATION_FAILED_AND_RESENT') {
        this.twoFaAuthModeMessage = 'Pin code is wrong. New pin was sended to your email.';
        this.pinFormCode.setValue('');
        this.pinFormCode.setErrors({ pinError: true });
      } else if (err.error.title === 'EMAIL_AUTHORIZATION_PIN_EXPIRED') {
        this.twoFaAuthModeMessage = 'This pin is expired. New pin was sended to your email.';
        this.pinFormCode.setValue('');
        this.pinFormCode.setErrors({ pinError: true });
      } else {
        this.setTemplate('logInTemplate');
        this.statusMessage = !AUTH_MESSAGES[err.error.title] ? '' : AUTH_MESSAGES[err.error.title];
      }
    } else {
      this.setTemplate('logInTemplate');
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
        this.pin = this.pinFormCode.value;
        this.pincodeAttempts += 1;
      }
      if (this.inPineCodeMode && !this.pin) {
        return;
      }
      this.sendToServer();
    }
  }

  sendToServer() {
    this.store.dispatch(new coreActions.Load2faStatusAction(this.email));
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
          this.redirectTo();
          this.loading = false;
        },
        err => {
          this.is2faEnabled$.subscribe(status => {
            if (typeof status === 'boolean') {
              this.setStatusMessage(err, status);
            }
          });
          this.loading = false;
        }
      );
  }

  redirectTo() {
    if (this.utilsService.isMainPage) {
      this.router.navigate(['/dashboard']);
    }
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

  get pinFormCode() {
    return this.pinForm.controls['pin'];
  }

  get loginFormPassword() {
    return this.loginForm.controls['password'];
  }
  get loginFormEmail() {
    return this.loginForm.controls['email'];
  }
}
