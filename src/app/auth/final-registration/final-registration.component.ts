import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../shared/services/user.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/services/auth.service';
import {environment} from '../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';

declare var encodePassword: Function;
declare var sendConfirmationPasswordGtag: Function;

@Component({
  selector: 'app-final-registration',
  templateUrl: './final-registration.component.html',
  styleUrls: ['./final-registration.component.scss']
})
export class FinalRegistrationComponent implements OnInit {
  passwordForm: FormGroup;
  isPasswordVisible = false;
  token: string;
  password;
  confirmPass;
  message: string;
  public msgRed = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.message = this.translateService.instant('Now, we need to create strong password.');
    this.token = this.activatedRoute.snapshot.queryParamMap.get('t');
  }

  getInputType(): string {
    return this.isPasswordVisible ? 'text' : 'password';
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  initForm(): void {
    this.passwordForm = new FormGroup({
      password: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(40),
          Validators.pattern(/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]|(?=.*[A-Za-z])(?=.*[!@#\$%\^&\*<>\.\(\)\-_=\+\'])[A-Za-z!@#\$%\^&\*<>\.\(\)\-_=\+\']/)
        ]
      }),
      confirmPassword: new FormControl('', {validators: [Validators.required, this.confirmPassword.bind(this)]})
    });
  }

  createUser(): void {
    console.log(this.passwordForm);
    if (this.passwordForm.valid) {
      const sendData = {
        tempToken: this.token,
        password: this.encryptPass(this.passwordForm.controls['password'].value),
      };
      this.userService.finalRegistration(sendData).subscribe(res => {
        const tokenHolder = {
          token: res.token,
          nickname: res.nickName,
          userId: res.id,
          avatarPath: null,
          language: res.language,
          finPasswordSet: res.finPasswordSet,
          referralReference: res.referralReference,
        };
        this.authService.setTokenHolder(tokenHolder);
        this.router.navigate(['/']);
        sendConfirmationPasswordGtag();
      }, err => {
        this.message = this.translateService.instant('Server error. Try again.');
      });
    }
    // console.log(sendData);
  }

  onRepeatPasswordInput(event) {
    if (event.data === ' ') {
      const temp = this.deleteSpace(event.target.value);
      this.passwordForm.controls['confirmPassword'].setValue(temp);
    }
  }

  onPasswordInput(event) {
    if (event.data === ' ') {
      const temp = this.deleteSpace(event.target.value);
      this.passwordForm.controls['password'].setValue(temp);
    }

    const confirm = this.passwordForm.controls['confirmPassword'];
    this.msgRed = event.target.value === confirm.value;
    confirm.value !== '' && event.target.value !== confirm.value ?
      confirm.setErrors({'passwordConfirm': true}) :
      confirm.setErrors(null);
  }

  deleteSpace(value): string {
    if (value) {
      const replaceMask = '';
      const searchMask = ' ';
      const regex = new RegExp(searchMask, 'ig');
      return value.toString().replace(regex, replaceMask);
    }
    return '';
  }

  confirmPassword(password: FormControl): { [s: string]: boolean } {
    this.msgRed = this.password === password.value;
    if (this.password !== password.value) {
      return {'passwordConfirm': true};
    }
    return null;
  }

  private encryptPass(pass: string): string {
    return encodePassword(pass, environment.encodeKey);
  }
}
