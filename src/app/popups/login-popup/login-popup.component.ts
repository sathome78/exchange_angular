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
      this.userService.authenticateUser(email, password).subscribe((tokenHolder: TokenHolder) => {

        console.log(tokenHolder);
        this.authService.setTokenHolder(tokenHolder);
          // this.popupService.closeLoginPopup();
          // this.router.navigate(['/']);
        },
        error1 => {

          console.log(error1);
          this.form.reset('');
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
