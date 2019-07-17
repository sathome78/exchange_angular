import {Component, OnInit, TemplateRef, ViewChild, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs';


import {PopupService} from '../../shared/services/popup.service';
import {UserService} from '../../shared/services/user.service';
import {UtilsService} from '../../shared/services/utils.service';
import {keys} from '../../shared/constants';
import {AUTH_MESSAGES} from '../../shared/constants';
import {GtagService} from '../../shared/services/gtag.service';

@Component({
  selector: 'app-recovery-pass',
  templateUrl: './recovery-pass.component.html',
  styleUrls: ['./recovery-pass.component.scss']
})
export class RecoveryPassComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @ViewChild('emailInputTemplate') emailInputTemplate: TemplateRef<any>;
  @ViewChild('captchaTemplate') captchaTemplate: TemplateRef<any>;
  @ViewChild('emailConfirmLinkTemplate') emailConfirmLinkTemplate: TemplateRef<any>;
  @ViewChild('devCaptchaTemplate') public devCaptchaTemplate: TemplateRef<any>;
  public currentTemplate: TemplateRef<any>;
  public emailForm: FormGroup;
  public afterCaptchaMessage = '';
  public recaptchaKey = keys.recaptchaKey;
  public AUTH_MESSAGES = AUTH_MESSAGES;
  public serverError = '';
  public loading = false;

  constructor(
    private popupService: PopupService,
    private userService: UserService,
    private translateService: TranslateService,
    private utilsService: UtilsService,
    private gtagService: GtagService
  ) { }

  ngOnInit() {
    this.setTemplate('emailInputTemplate');
    // this.setTemplate('emailConfirmLinkTemplate');
    this.initForm();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initForm() {
    this.emailForm = new FormGroup({
      email: new FormControl('', {
        validators: [
          Validators.required,
          this.utilsService.emailValidator(),
          this.utilsService.specialCharacterValidator()
        ],
        // asyncValidators: [this.userService.emailValidator(true)]
      }),
    });
  }

  closeMe() {
    this.popupService.closeRecoveryPasswordPopup();
  }

  backToLogin() {
    this.popupService.showMobileLoginPopup(true);
    this.closeMe();
  }

  emailSubmit() {
    const email = this.emailForm.get('email').value;
    if (this.utilsService.isDevCaptcha(email)) {
      this.setTemplate('devCaptchaTemplate');
      return;
    }
    this.setTemplate('captchaTemplate');
  }

  resolvedCaptcha() {
    const email = this.emailForm.get('email').value;
    this.loading = true;
    this.userService.checkIfEmailExists(email)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
          this.sendEmail(email);

        }, error => {
          this.serverError = error.status === 400 ? error.error.title : 'OTHER_HTTP_ERROR';
          this.emailForm.markAsPristine();
          this.emailForm.markAsUntouched();
          this.setTemplate('emailInputTemplate');
          this.loading = false;
        });
  }

  private sendEmail(email: string) {
    this.userService.sendToEmailForRecovery(email)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.afterCaptchaMessage = `${this.translateService.instant('We sent the confirmation link to')}
          ${email} <br> ${this.translateService.instant('Please check your email and follow instructions.')}`;
        this.setTemplate('emailConfirmLinkTemplate');
        this.gtagService.sendRecoveryPasswordGtag();
        this.loading = false;
      }, error => {
        this.afterCaptchaMessage = this.translateService.instant('Service is temporary unavailable, please try again later.');
        this.setTemplate('emailConfirmLinkTemplate');
        this.loading = false;
      });
  }

  setTemplate(template: string) {
    switch (template) {
      case 'emailInputTemplate':
        this.currentTemplate = this.emailInputTemplate;
        break;
      case 'captchaTemplate':
        this.currentTemplate = this.captchaTemplate;
        break;
      case 'emailConfirmLinkTemplate':
        this.currentTemplate = this.emailConfirmLinkTemplate;
        break;
      case 'devCaptchaTemplate':
        this.currentTemplate = this.devCaptchaTemplate;
        break;
    }
  }

}
