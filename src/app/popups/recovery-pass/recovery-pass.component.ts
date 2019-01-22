import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PopupService} from '../../shared/services/popup.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../shared/services/user.service';
import {keys} from '../../core/keys';
import {TranslateService} from '@ngx-translate/core';
import {UtilsService} from '../../shared/services/utils.service';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

declare var sendRecoveryPasswordGtag: Function;

@Component({
  selector: 'app-recovery-pass',
  templateUrl: './recovery-pass.component.html',
  styleUrls: ['./recovery-pass.component.scss']
})
export class RecoveryPassComponent implements OnInit, OnDestroy{

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild('emailInputTemplate') emailInputTemplate: TemplateRef<any>;
  @ViewChild('captchaTemplate') captchaTemplate: TemplateRef<any>;
  @ViewChild('emailConfirmLinkTemplate') emailConfirmLinkTemplate: TemplateRef<any>;
  public currentTemplate: TemplateRef<any>;
  public emailForm: FormGroup;
  public email: string;
  public emailMessage ;
  public afterCaptchaMessage = '';
  public recaptchaKey = keys.recaptchaKey;
  public emailSubmited = false;

  constructor(
    private popupService: PopupService,
    private userService: UserService,
    private utilsService: UtilsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.setTemplate('emailInputTemplate');
    // this.setTemplate('emailConfirmLinkTemplate');
    this.initForm();


    this.emailForm.valueChanges
      .pipe(debounceTime(1000))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(term => {
        if (this.emailForm.valid) {
          this.userService.checkIfEmailExists(term.email)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
            if (res) {
              this.emailMessage = '';
            } else {
              this.emailMessage = this.translateService.instant('This email doesn\'t exist.');
            }
          }, err => {
            console.log(err);
          });
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initForm() {
    this.emailForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, this.utilsService.emailValidator(), this.utilsService.specialCharacterValidator()]
        , updateOn: 'blur'}),
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
    this.emailSubmited = true;
    if (this.emailForm.valid && this.emailMessage === '') {
      this.email = this.emailForm.get('email').value;

      this.setTemplate('captchaTemplate');
      sendRecoveryPasswordGtag();
    }
  }

  resolvedCaptcha(event) {
    this.userService.sendToEmailForRecovery(this.email).subscribe(res => {
      this.afterCaptchaMessage = `We sent the confirmation link to
        ${this.email} <br> Please check your email and
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
