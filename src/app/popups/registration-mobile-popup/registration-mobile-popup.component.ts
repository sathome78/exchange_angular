import { Component, OnInit, TemplateRef, ViewChild, OnDestroy, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/internal/operators';

import { PopupService } from '../../shared/services/popup.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { keys, AUTH_MESSAGES } from '../../shared/constants';
import { UtilsService } from 'app/shared/services/utils.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { GtagService } from '../../shared/services/gtag.service';

@Component({
  selector: 'app-registration-mobile-popup',
  templateUrl: './registration-mobile-popup.component.html',
  styleUrls: ['./registration-mobile-popup.component.scss'],
})
export class RegistrationMobilePopupComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public currentTemplate: TemplateRef<any>;
  @ViewChild('emailInputTemplate') emailInputTemplate: TemplateRef<any>;
  @ViewChild('nameInputTemplate') nameInputTemplate: TemplateRef<any>;
  @ViewChild('captchaTemplate') captchaTemplate: TemplateRef<any>;
  @ViewChild('devCaptchaTemplate') devCaptchaTemplate: TemplateRef<any>;
  @ViewChild('emailConfirmLinkTemplate') emailConfirmLinkTemplate: TemplateRef<any>;
  @ViewChild('passwordTemplate') passwordTemplate: TemplateRef<any>;
  @Input() public email = '';

  public emailForm: FormGroup;
  public passwordForm: FormGroup;
  public nameForm: FormGroup;
  public nameSubmited = false;
  public recaptchaKey = keys.recaptchaKey;
  public AUTH_MESSAGES = AUTH_MESSAGES;
  public emailServerError = 'start';
  public pendingCheckEmail = false;
  public loading = false;
  public previousEmail = '';

  public firstName;
  public afterCaptchaMessage;

  constructor(
    public popupService: PopupService,
    private userService: UserService,
    private translateService: TranslateService,
    private utilsService: UtilsService,
    private location: Location,
    private gtagService: GtagService
  ) {}

  ngOnInit() {
    this.setTemplate('emailInputTemplate');
    this.initForm();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setTemplate(template: string) {
    switch (template) {
      case 'emailInputTemplate':
        this.currentTemplate = this.emailInputTemplate;
        break;
      case 'nameInputTemplate':
        this.currentTemplate = this.nameInputTemplate;
        break;
      case 'captchaTemplate':
        this.currentTemplate = this.captchaTemplate;
        break;
      case 'emailConfirmLinkTemplate':
        this.currentTemplate = this.emailConfirmLinkTemplate;
        break;
      case 'passwordTemplate':
        this.currentTemplate = this.passwordTemplate;
        break;
      case 'devCaptchaTemplate':
        this.currentTemplate = this.devCaptchaTemplate;
        break;
    }
  }

  closeMe() {
    this.popupService.closeRegistrationPopup();
    if (this.location.path() === '/registration') {
      this.location.replaceState('dashboard');
    }
  }

  resolvedCaptcha(event) {
    const email = this.formEmailGetter.value.trim();
    const isUsa = this.formIsUsaGetter.value;
    this.loading = true;
    this.userService
      .sendToEmailConfirmation(email, isUsa)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        res => {
          this.afterCaptchaMessage = `${this.translateService.instant('We sent the confirmation link to')}
            <br> <span class="popup__email-link"> ${email} </span> <br>
            ${this.translateService.instant('Please check your email and follow instructions.')}`;
          this.setTemplate('emailConfirmLinkTemplate');
          this.gtagService.sendRegistrationGtag();
          this.loading = false;
        },
        error => {
          console.error(error);
          this.afterCaptchaMessage = this.translateService.instant(
            'Service is temporary unavailable, please try again later'
          );
          this.setTemplate('emailConfirmLinkTemplate');
          this.loading = false;
        }
      );
  }

  openLogInMobile() {
    this.closeMe();
    this.popupService.showMobileLoginPopup(true);
  }

  initForm() {
    this.emailForm = new FormGroup({
      email: new FormControl('', {
        validators: [
          Validators.required,
          this.utilsService.emailValidator(),
          this.utilsService.specialCharacterValidator(),
        ],
      }),
      isUsa: new FormControl(null, { validators: Validators.required }),
      terms: new FormControl(null, { validators: Validators.required }),
    });
    this.passwordForm = new FormGroup({
      password: new FormControl('', { validators: [Validators.required] }),
    });

    this.nameForm = new FormGroup({
      username: new FormControl('', { validators: Validators.required }),
    });

    if (this.email.trim()) {
      this.formEmailGetter.setValue(this.email.trim());
      this.formEmailGetter.markAsTouched();
      this.formEmailGetter.updateValueAndValidity();
      this.checkEmailOfServer();
    }

    this.formEmailGetter
      .valueChanges.pipe(debounceTime(1500))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.checkEmailOfServer();
      });
  }

  checkEmailOfServer() {
    this.pendingCheckEmail = true;
    this.emailServerError = 'start';
    this.formEmailGetter.markAsTouched();
    if (
      this.formEmailGetter.valid &&
      this.formEmailGetter.value.trim() !== this.previousEmail &&
      this.formEmailGetter.value.trim() !== ''
    ) {
      this.previousEmail = this.formEmailGetter.value.trim();
      this.userService
        .checkIfEmailExists(this.formEmailGetter.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          res => {
            this.emailServerError = res ? 'EMAIL_EXIST' : '';
            this.pendingCheckEmail = false;
          },
          error => {
            if (error.status === 400) {
              this.emailServerError = error.error.title === 'USER_EMAIL_NOT_FOUND' ? '' : error.error.title;
            } else {
              this.emailServerError = 'OTHER_HTTP_ERROR';
            }
            this.pendingCheckEmail = false;
          }
        );
    }
  }

  emailSubmit() {
    const email = this.formEmailGetter.value;
    if (this.utilsService.isDevCaptcha(email)) {
      this.setTemplate('devCaptchaTemplate');
      return;
    }
    if (this.emailForm.valid && !this.pendingCheckEmail) {
      this.setTemplate('captchaTemplate');
    }
  }

  get formDisabled(): boolean {
    return this.emailForm.invalid || this.pendingCheckEmail || !!this.emailServerError;
  }

  get formEmailGetter() {
    return this.emailForm.controls['email'];
  }
  get formIsUsaGetter() {
    return this.emailForm.controls['isUsa'];
  }
}
