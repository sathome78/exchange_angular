import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PopupService } from '../../shared/services/popup.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenHolder } from '../../model/token-holder.model';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { LoggingService } from '../../shared/services/logging.service';
import { keys } from '../../core/keys';
import { isCombinedNodeFlagSet } from 'tslint';
import {TranslateService} from '@ngx-translate/core';
import { UtilsService } from 'app/shared/services/utils.service';

declare var sendLoginSuccessGtag: Function;

@Component({
  selector: 'app-login-popup-mobile',
  templateUrl: './login-popup-mobile.component.html',
  styleUrls: ['./login-popup-mobile.component.scss']
})
export class LoginPopupMobileComponent implements OnInit {

  public recaptchaKey = keys.recaptchaKey;
  isPasswordVisible = false;
  twoFaAuthModeMessage = 'Please enter two-factor <br> authentication code';
  pincodeAttempts = 0;
  public isError = false;
  public statusMessage = '';
  public inPineCodeMode;
  public isGA = false;
  public isGACheck = false;
  public afterCaptchaMessage;

  public currentTemplate: TemplateRef<any>;
  @ViewChild('logInTemplate') logInTemplate: TemplateRef<any>;
  @ViewChild('pinCodeTemplate') pinCodeTemplate: TemplateRef<any>;
  @ViewChild('captchaTemplate') captchaTemplate: TemplateRef<any>;
  public loginForm: FormGroup;
  public pinForm: FormGroup;
  isPinEmpty;
  public showSendAgainBtn: boolean = false;

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
  ) {
  }

  ngOnInit() {
    this.setTemplate('logInTemplate');
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, this.utilsService.emailValidator()]}),
      password: new FormControl('', { validators: Validators.required })
    });
    this.pinForm = new FormGroup({
      pin: new FormControl('', { validators: Validators.required })
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
        break;
      case 'captchaTemplate':
        this.currentTemplate = this.captchaTemplate;
        break;
    }
  }

  closeMe() {
    this.popupService.closeMobileLoginPopup();
  }

  openRegistration() {
    this.popupService.showMobileRegistrationPopup(true);
    this.closeMe();
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  checkGoogleLoginEnabled(email: string): void {
    this.userService.getUserGoogleLoginEnabled(email)
      .subscribe(result => {
        this.isGACheck = true;
        if (result) {
          this.isGA = true;
          this.twoFaAuthModeMessage = this.translateService.instant('Use Google Authenticator to generate pincode');
        }
      },
        err => console.log(err));
  }

  setStatusMessage(status) {
    this.showSendAgainBtn = false;
    switch (status) {
      case 401:
      case 422:
        this.statusMessage = this.translateService.instant('Wrong email or password!');
        break;
      case 426:
        this.statusMessage = this.translateService.instant(`Seems, that your user is still inactive. Email with activation link has been sent to your email address. Please, check and follow the instructions.`);
        // this.showSendAgainBtn = true;
        break;
      case 403:
        this.statusMessage = this.translateService.instant('You are not allowed to access');
        break;
      case 410:
        this.statusMessage = this.translateService.instant('Your account has been blocked. To find out the reason of blocking - contact the exchange support service.');
        break;
      case 419:
        this.statusMessage = this.translateService.instant('Your ip is blocked!');
        break;
      case 418:
        if (!this.isGACheck) {
          this.checkGoogleLoginEnabled(this.email);
        }
        this.inPineCodeMode = true;
        this.setTemplate('pinCodeTemplate');
        this.pinForm.reset();
        if (this.pincodeAttempts > 0) {
          this.isError = true;
          this.twoFaAuthModeMessage = this.pincodeAttempts === 3 ?
            this.isGA ?
              this.translateService.instant(' Code is wrong! Please, check you code in Google Authenticator application.') :
              this.translateService.instant('Code is wrong! New code was sent to your email.') :
            this.translateService.instant('Code is wrong!');
          this.pincodeAttempts = this.pincodeAttempts === 3 ? 0 : this.pincodeAttempts;
          this.pinForm.get('pin').patchValue('');
        } else {
          this.statusMessage = this.translateService.instant('Pin code is required!');
        }
    }
  }

  onSubmit() {
    this.setTemplate('captchaTemplate');
  }

  afterResolvedCaptcha(event) {
    // this.setTemplate('logInTemplate');
    if (this.loginForm.valid) {
      this.email = this.loginForm.get('email').value.trim();
      this.password = this.loginForm.get('password').value;
      if (this.inPineCodeMode) {
        this.pin = this.pinForm.get('pin').value;
        this.pincodeAttempts++;
      }
      if (this.inPineCodeMode && !this.pin) {
        return;
      }
      this.sendToServer();
    }
  }

  // afterResolvedCaptcha(event) {
  //   this.userService.sendToEmailConfirmation(this.email).subscribe(res => {
  //     console.log(res);
  //     this.setTemplate('emailConfirmLinkTemplate');
  //   }, error => {
  //     this.afterCaptchaMessage = `server error`;
  //     this.setTemplate('emailConfirmLinkTemplate');
  //   });
  //
  // }

  sendToServer() {
    // console.log(this.email, this.password, this.pin);
    this.logger.debug(this, 'attempt to authenticate with email: ' + this.email + ' and password: ' + this.password);
    this.userService.authenticateUser(this.email, this.password, this.pin, this.pincodeAttempts)
      .subscribe((tokenHolder: TokenHolder) => {
        sendLoginSuccessGtag();
        this.logger.debug(this, 'User { login: ' + this.email + ', pass: ' + this.password + '}' + ' signed in and obtained' + tokenHolder);
        this.authService.setTokenHolder(tokenHolder);
        this.authService.onLogIn();
        this.popupService.closeMobileLoginPopup();
        this.router.navigate(['/']);
        // TODO: just for promo state, remove after
        location.reload();
      },
        err => {
          console.log(err, 'sendToServerError')
          const status = err['status'];
          this.setTemplate('logInTemplate');
          this.setStatusMessage(status);
        });
  }

  getInputType(): string {
    return this.isPasswordVisible ? 'text' : 'password';
  }

  openRecoveryPasswordPopup() {
    this.popupService.showRecoveryPasswordPopup(true);
    this.closeMe();
  }

  sendAgain() {

  }
}
