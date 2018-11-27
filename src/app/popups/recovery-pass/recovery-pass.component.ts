import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PopupService} from '../../services/popup.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {keys} from '../../core/keys';

@Component({
  selector: 'app-recovery-pass',
  templateUrl: './recovery-pass.component.html',
  styleUrls: ['./recovery-pass.component.scss']
})
export class RecoveryPassComponent implements OnInit {


  @ViewChild('emailInputTemplate') emailInputTemplate: TemplateRef<any>;
  @ViewChild('captchaTemplate') captchaTemplate: TemplateRef<any>;
  @ViewChild('emailConfirmLinkTemplate') emailConfirmLinkTemplate: TemplateRef<any>;
  public currentTemplate: TemplateRef<any>;
  public emailForm: FormGroup;
  public email: string;
  public emailMessage = '';
  public afterCaptchaMessage = '';
  public recaptchaKey = keys.recaptchaKey;
  public emailSubmited = false;
  public emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

  constructor(
    private popupService: PopupService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.setTemplate('emailInputTemplate');
    // this.setTemplate('emailConfirmLinkTemplate');
    this.initForm();
    this.afterCaptchaMessage;
  }

  initForm() {
    this.emailForm = new FormGroup({
      email: new FormControl('', {validators: [Validators.required, Validators.pattern(this.emailRegex)]}),
    });
  }

  closeMe() {
    this.popupService.closeRecoveryPasswordPopup();
  }

  backToLogin() {
    this.popupService.showLoginPopup(true);
    this.closeMe();
  }

  emailSubmit() {
    this.emailSubmited = true;
    if (this.emailForm.valid) {
      const email = this.emailForm.get('email').value;
      this.email = email;
      this.userService.checkIfEmailExists(email).subscribe(res => {
        if (res) {
          this.email = email;
          this.setTemplate('captchaTemplate');
          this.emailMessage = '';
        } else {
          this.emailMessage = 'this email not found';
        }
      }, err => {
        this.emailMessage = 'server error';
      });
    }
  }

  resolvedCaptcha(event) {
    this.userService.sendToEmailForRecovery(this.email).subscribe(res => {
      this.afterCaptchaMessage = `We sent the confirmation link to
        ${this.email} <br> Please check your email and
        follow instructions.`;
      this.setTemplate('emailConfirmLinkTemplate');
    }, error => {
      this.afterCaptchaMessage = `server error`;
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
