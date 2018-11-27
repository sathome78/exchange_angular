import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initForm();
    this.message = 'Now, we need to create strong password.';
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
          Validators.required, Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}/)
        ]}),
      confirmPassword: new FormControl( null, {validators: [Validators.required, this.confirmPassword.bind(this)]})
    });
  }

  createUser(): void {
    console.log(this.passwordForm)
    const sendData = {
      tempToken: this.token,
      password: this.encryptPass(this.passwordForm.controls['password'].value),
    };
    this.userService.recoveryPassword(sendData).subscribe(res => {
      this.router.navigate(['/dashboard'], {queryParams: {recoveryPassword: true}});
    }, err => {
      this.message = 'Server error. Try again.';
    });
  }

  confirmPassword(password: FormControl): { [s: string]: boolean } {
    if (this.password !== password.value) {
      return {'passwordConfirm': true};
    }
    return null;
  }
  private encryptPass(pass: string): string {
    return encodePassword(pass, environment.encodeKey);
  }

}
