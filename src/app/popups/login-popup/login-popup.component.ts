import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PopupService} from '../../services/popup.service';
import {UserService} from '../../services/user.service';
import {LoggingService} from '../../services/logging.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {TokenHolder} from '../../model/token-holder.model';
import {SettingsService} from '../../settings/settings.service';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss']
})
export class LoginPopupComponent implements OnInit {

  form: FormGroup;
  emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
  isPasswordVisible = false;
  pincodeAttempts = 0;

  statusMessage = '';
  inPineCodeMode = false;
  twoFaAuthModeMessage = 'Pincode is sent to your email';
  isGoogleAuthEnabled = false;


  constructor(private popupService: PopupService,
              private userService: UserService,
              private logger: LoggingService,
              private authService: AuthService,
              private settingsService: SettingsService,
              private router: Router) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl(null, {
        validators: [Validators.required, Validators.pattern(this.emailRegex)],
        updateOn: 'blur'
      }),
      'password': new FormControl(null, {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      'pin': new FormControl(null, {validators: this.requiredPincode.bind(this)})
    });
    this.inPineCodeMode = false;
  }

  closeMe() {
    this.popupService.closeLoginPopup();
  }

  onProcess() {
    console.log(this.form.valid);
    if (this.form.valid) {
      const email = this.form.get('email').value;
      const password = this.form.get('password').value;
      let pin;
      if (this.inPineCodeMode) {
        pin = this.form.get('pin').value;
        this.pincodeAttempts++;
      }
      this.logger.debug(this, 'attempt to authenticate with email: ' + email + ' and password: ' + password);
      this.userService.authenticateUser(email, password, pin)
        .subscribe((tokenHolder: TokenHolder) => {
            this.logger.debug(this, 'User { login: ' + email + ', pass: ' + password + '}' + ' signed in and obtained' + tokenHolder);
            this.authService.setTokenHolder(tokenHolder);
            this.popupService.closeLoginPopup();
            this.router.navigate(['/']);
            // TODO: just for promo state, remove after
            location.reload();
          },
          err => {
            const status = err['status'];
            console.log('status: ' + status);
            if (status === 401 || status === 422) {
              this.logger.info(this, 'Attempt to sign in with invalid credentials: { login: ' + email + ', pass: ' + password + '}');
              this.statusMessage = 'Your email and/or password are invalid!';
            } else if (status >= 500) {
              this.logger.error(this, 'Sever failure when sigh in with credentials: { login: ' + email + ', pass: ' + password + '}');
              // redirect to 500 page
              this.statusMessage = 'Service temporary unavailable';
            } else if (status === 416) {
              this.logger.info(this, 'Attempt to sign in by unconfirmed user: { login: ' + email + ', pass: ' + password + '}');
              this.statusMessage = 'Attention! Security issue! Please, immediately contact our support!';
            } else if (status === 426) {
              this.logger.info(this, 'Attempt to sign in by unconfirmed user: { login: ' + email + ', pass: ' + password + '}');
              this.statusMessage = 'It seems you didn\'t completed your registration';
            } else if (status === 403) {
              this.statusMessage = 'You are not allowed to access';
            } else if (status === 410) {
              this.logger.info(this, 'Attempt to sign in by inactive (deleted) user: { login: ' + email + ', pass: ' + password + '}');
              this.statusMessage = 'User inactive(deleted)';
            } else if (status === 419) {
              this.statusMessage = 'Your ip is blocked!';
            } else if (status === 418) {
              this.checkGoogleLoginEnabled(email);
              this.inPineCodeMode = true;
              if (this.pincodeAttempts > 0) {
                this.statusMessage = 'Wrong pincode, new pincode is sent!';
                this.form.get('pin').patchValue('');
              } else {
                this.statusMessage = 'Pin code is required!';
              }
            }
            // this.form.reset('');
          });
    }
  }

  checkGoogleLoginEnabled(email: string): void {
    this.userService.getUserGoogleLoginEnabled(email)
      .subscribe(result => {
          if (result) {
            this.twoFaAuthModeMessage = 'Use google authenticator to generate pincode';
          }
        },
        err => console.log(err));
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  getInputType(): string {
    return this.isPasswordVisible ? 'text' : 'password';
  }

  requiredPincode(pin: FormControl): { [s: string]: boolean } {
    if (this.inPineCodeMode && (pin.value === undefined || pin.value === '')) {
      return {'pinRequired': true};
    }
    return null;
  }
}
