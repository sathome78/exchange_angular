import {Component, OnInit, TemplateRef, ViewChild, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs';

import {PopupService} from '../../shared/services/popup.service';
import {UserService} from '../../shared/services/user.service';
import {UtilsService} from '../../shared/services/utils.service';
import {keys} from '../../core/keys';

declare var sendRecoveryPasswordGtag: Function;

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
  public currentTemplate: TemplateRef<any>;
  public emailForm: FormGroup;
  public afterCaptchaMessage = '';
  public recaptchaKey = keys.recaptchaKey;

  constructor(
    private popupService: PopupService,
    private userService: UserService,
    private translateService: TranslateService,
    private utilsService: UtilsService
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
        asyncValidators: [this.userService.emailValidator(true)]
      }),
    }, {updateOn: 'blur'});
  }

  closeMe() {
    this.popupService.closeRecoveryPasswordPopup();
  }

  backToLogin() {
    this.popupService.showMobileLoginPopup(true);
    this.closeMe();
  }

  emailSubmit() {
    this.setTemplate('captchaTemplate');
    sendRecoveryPasswordGtag();
  }

  resolvedCaptcha(event) {
    const email = this.emailForm.get('email').value;
    this.userService.sendToEmailForRecovery(email)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.afterCaptchaMessage = `We sent the confirmation link to
          ${email} <br> Please check your email and
          follow instructions.`;
        this.setTemplate('emailConfirmLinkTemplate');
      }, error => {
        this.afterCaptchaMessage = this.translateService.instant('server error');
        this.setTemplate('emailConfirmLinkTemplate');
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
    }
  }

}
