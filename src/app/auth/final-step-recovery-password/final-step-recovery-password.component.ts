import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../shared/services/user.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
declare var encodePassword: Function;

@Component({
  selector: 'app-final-step-recovery-password',
  templateUrl: './final-step-recovery-password.component.html',
  styleUrls: ['./final-step-recovery-password.component.scss']
})
export class FinalStepRecoveryPasswordComponent implements OnInit {
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
  ) { }

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
      password: new FormControl('', {
        validators: [
          Validators.required, Validators.minLength(8),
          Validators.pattern(/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]|(?=.*[A-Za-z])(?=.*[!@#\$%\^&\*<>\.\(\)\-_=\+\'])[A-Za-z!@#\$%\^&\*<>\.\(\)\-_=\+\']/)
        ]}),
      confirmPassword: new FormControl( '', {validators: [Validators.required, this.confirmPassword.bind(this)]})
    });
  }

  isLower(character) {
    return (character === character.toLowerCase()) && (character !== character.toUpperCase());
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

  onRepeatPasswordInput(event) {
    if (event.data === ' ') {
      const temp = this.deleteSpace(event.target.value);
      this.passwordForm.controls['confirmPassword'].setValue(temp);
    }
  }

  createUser(): void {
    console.log(this.passwordForm)
    const pass = this.passwordForm.controls['password'];
    if (this.passwordForm.valid && pass.value === this.passwordForm.controls['confirmPassword'].value) {
      const sendData = {
        tempToken: this.token,
        password: this.encryptPass(pass.value),
      };
      this.userService.recoveryPassword(sendData).subscribe(res => {
        this.router.navigate(['/dashboard'], {queryParams: {recoveryPassword: true}});
      }, err => {
        this.message = this.translateService.instant('Server error. Try again.');
      });
    }
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
