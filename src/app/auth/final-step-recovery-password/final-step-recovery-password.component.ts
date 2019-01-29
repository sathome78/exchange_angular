import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../shared/services/user.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {UtilsService} from 'app/shared/services/utils.service';
import {PopupService} from 'app/shared/services/popup.service';
import {Location} from '@angular/common';
declare var encodePassword: Function;

@Component({
  selector: 'app-final-step-recovery-password',
  templateUrl: './final-step-recovery-password.component.html',
  styleUrls: ['./final-step-recovery-password.component.scss']
})
export class FinalStepRecoveryPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  passwordFirst: FormControl;
  passwordSecond: FormControl;
  isPasswordVisible = false;
  token: string;
  message: string;
  public msgRed = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private utilsService: UtilsService,
    private popupService: PopupService,
    private location: Location,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.location.replaceState('recovery-password')
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
    this.passwordFirst = new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(40),
        this.utilsService.passwordCombinationValidator()
      ]
    });
    this.passwordSecond = new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(40),
        this.utilsService.passwordCombinationValidator(),
        this.utilsService.passwordMatchValidator(this.passwordFirst)
      ]
    });
    this.passwordForm = new FormGroup({
      'password': this.passwordFirst,
      'confirmPassword': this.passwordSecond,
    });
  }

  createUser(): void {
    // console.log(this.passwordForm)
    const pass = this.passwordForm.controls['password'];
    if (this.passwordForm.valid) {
      const sendData = {
        tempToken: this.token,
        password: this.encryptPass(pass.value),
      };
      this.userService.recoveryPassword(sendData).subscribe(res => {
        this.router.navigate(['/dashboard']);
        this.popupService.toggleRestoredPasswordPopup(true);
      }, err => {
        this.message = this.translateService.instant('Server error. Try again.');
      });
    }
  }

  private encryptPass(pass: string): string {
    return encodePassword(pass, environment.encodeKey);
  }

  get getConfirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }
  get getFirstPassword() {
    return this.passwordForm.get('password');
  }

}
