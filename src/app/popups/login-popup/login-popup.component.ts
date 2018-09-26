import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PopupService} from '../../services/popup.service';
import {UserService} from '../../services/user.service';
import {LoggingService} from '../../services/logging.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {TokenHolder} from '../../model/token-holder.model';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss']
})
export class LoginPopupComponent implements OnInit {

  form: FormGroup;
  emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
  isPasswordVisible = false;

  statusMessage = '';

  constructor(private popupService: PopupService,
              private userService: UserService,
              private logger: LoggingService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl('oleg_podolian@ukr.net', {
        validators: [Validators.required, Validators.pattern(this.emailRegex)],
        updateOn: 'blur'
      }),
      'password': new FormControl('12345678a', {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
    });
  }

  closeMe() {
    this.popupService.closeLoginPopup();
  }

  onSubmit() {
    if (this.form.valid) {
      const email = this.form.get('email').value;
      const password = this.form.get('password').value;
      this.logger.debug(this, 'attempt to authenticate with email: ' + email + ' and password: ' + password);
      this.userService.authenticateUser(email, password)
        .subscribe((tokenHolder: TokenHolder) => {
            this.logger.debug(this, 'User { login: ' + email + ', pass: ' + password + '}' + ' signed in and obtained' + tokenHolder);
            this.authService.setTokenHolder(tokenHolder);
            this.popupService.closeLoginPopup();
            this.router.navigate(['/']);
          },
          err => {
            const status = err['status'];
            if (status === 401) {
              this.logger.info(this, 'Attempt to sign in with invalid credentials: { login: ' + email + ', pass: ' + password + '}');
              this.statusMessage = 'Your email and/or password are invalid!';
            } else if (status >= 500) {
              this.logger.error(this, 'Sever failure when sigh in with credentials: { login: ' + email + ', pass: ' + password + '}');
              // redirect to 500 page
              this.statusMessage = 'Sorry we died!';
            } else if (status === 426) {
              this.logger.info(this, 'Attempt to sign in by unconfirmed user: { login: ' + email + ', pass: ' + password + '}');
              this.statusMessage = 'It seems you didn\'t completed your registration';
            } else if (status === 410) {
              this.logger.info(this, 'Attempt to sign in by inactive (deleted) user: { login: ' + email + ', pass: ' + password + '}');
              this.statusMessage = 'Sorry, but we thought you died. Fuck off, stupid zombie!';
            }
            // this.form.reset('');
          });
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  getInputType(): string {
    return this.isPasswordVisible ? 'text' : 'password';
  }
}
