import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../shared/services/user.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/services/auth.service';
import {environment} from '../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {Location} from '@angular/common';
import {UtilsService} from '../../shared/services/utils.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

declare var encodePassword: Function;
declare var sendConfirmationPasswordGtag: Function;

@Component({
  selector: 'app-final-registration',
  templateUrl: './final-registration.component.html',
  styleUrls: ['./final-registration.component.scss']
})
export class FinalRegistrationComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  passwordForm: FormGroup;
  newPassword: FormControl;
  newConfirmPassword: FormControl;
  isPasswordVisible = false;
  token: string;
  password;
  confirmPass;
  message: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private utilsService: UtilsService,
    private location: Location,
    private translateService: TranslateService
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.location.replaceState('final-registration/token');
    this.message = this.translateService.instant('Now, we need to create strong password.');
    this.token = this.activatedRoute.snapshot.queryParamMap.get('t');
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getInputType(): string {
    return this.isPasswordVisible ? 'text' : 'password';
  }

  createUser(): void {
    if (this.passwordForm.valid) {
      const sendData = {
        tempToken: this.token,
        password: this.encryptPass(this.passwordFirst.value),
      };
      this.userService.finalRegistration(sendData)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
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
          this.message = this.translateService.instant('Service is temporary unavailable, please try again later.');
        });
    }
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

  get passwordFirst() {
    return this.passwordForm.get('password');
  }
  get passwordConfirm() {
    return this.passwordForm.get('confirmPassword');
  }

  initForm(): void {
    this.newPassword = new FormControl(null, {
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(40),
        this.utilsService.passwordCombinationValidator(),
      ]
    });
    this.newConfirmPassword = new FormControl('', {validators: [
        this.utilsService.passwordMatchValidator(this.newPassword)
      ]});

    this.passwordForm = new FormGroup({
      'password': this.newPassword,
      'confirmPassword': this.newConfirmPassword
    });

    this.observeForm();
  }

  observeForm() {
    this.passwordFirst.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        if (!this.passwordConfirm.touched) {
          return;
        }
        this.passwordConfirm.updateValueAndValidity();
      });
  }

  private encryptPass(pass: string): string {
    return encodePassword(pass, environment.encodeKey);
  }
}
