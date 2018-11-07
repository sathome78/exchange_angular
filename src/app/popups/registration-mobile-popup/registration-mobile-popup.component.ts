import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PopupService} from '../../services/popup.service';
import {convertValueToOutputAst} from '@angular/compiler/src/output/value_util';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-registration-mobile-popup',
  templateUrl: './registration-mobile-popup.component.html',
  styleUrls: ['./registration-mobile-popup.component.scss']
})
export class RegistrationMobilePopupComponent implements OnInit {

  public currentTemplate: TemplateRef<any>;
  @ViewChild('emailInputTemplate') emailInputTemplate: TemplateRef<any>;
  @ViewChild('nameInputTemplate') nameInputTemplate: TemplateRef<any>;
  @ViewChild('captchaTemplate') captchaTemplate: TemplateRef<any>;
  @ViewChild('emailConfirmLinkTemplate') emailConfirmLinkTemplate: TemplateRef<any>;
  @ViewChild('passwordTemplate') passwordTemplate: TemplateRef<any>;

  public emailForm: FormGroup;
  public emailSubmited = false;
  public passwordForm: FormGroup;
  public nameForm: FormGroup;
  public nameSubmited = false;
  public agreeTerms = false;
  public recaptchaKey = '6LcyFkMUAAAAAH3mt-7FJlipkIQg03qt5jCUJOW9';
  emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

  public email;
  public firstName;
  public emailMessage = '';

  constructor(
    private popupService: PopupService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.setTemplate('emailInputTemplate');
    this.initForm();
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
    }
  }

  closeMe() {
    this.popupService.closeRegistrationPopup();
  }

  resolvedCaptcha(event) {
    this.userService.sendToEmailConfirmation(this.email).subscribe(res => {
      console.log(res);
    });
    this.setTemplate('emailConfirmLinkTemplate');
  }

  openLogIn() {
    this.popupService.showMobileLoginPopup(true);
    this.closeMe();
  }

  initForm() {
    this.emailForm = new FormGroup({
      email: new FormControl('', {validators: [Validators.required, Validators.pattern(this.emailRegex)]}),
    });
    this.passwordForm = new FormGroup({
      password: new FormControl('', {validators: [Validators.required]}),
    });
    this.nameForm = new FormGroup({
      username: new FormControl('', {validators: Validators.required}),
    });
  }

  emailSubmit() {
    this.setTemplate('captchaTemplate');
    this.emailSubmited = true;
    if (this.emailForm.valid) {
      const email = this.emailForm.get('email').value;
      this.email = email;
      this.userService.checkIfEmailExists(email).subscribe(res => {
        if (!res) {
          this.email = email;
          this.setTemplate('captchaTemplate');
          this.emailMessage = '';
        } else {
          this.emailMessage = 'this email is already used';
        }
      }, err => {
        this.emailMessage = 'server error';
      });
    }
  }

  nameSubmit() {
    this.nameSubmited = true;
    if (this.nameForm.valid) {
      this.firstName = this.nameForm.get('username').valid;
      // this.userService.checkIfUsernameExists(this.firstName).subscribe(res => console.log(res));
      this.setTemplate('captchaTemplate');
    }
  }


}
