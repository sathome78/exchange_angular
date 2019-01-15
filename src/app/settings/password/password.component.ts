import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoggingService} from '../../shared/services/logging.service';
import {SettingsService} from '../settings.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {NotificationsService} from '../../shared/components/notification/notifications.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  form: FormGroup;
  passwordFirst: FormControl;
  isPasswordVisible: boolean;

  statusMessage: string;

  constructor(private logger: LoggingService,
              private notificationService: NotificationsService,
              private settingsService: SettingsService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.statusMessage = '';
    this.passwordFirst = new FormControl(null, {
      validators: [Validators.required, Validators.pattern('^((?=.*\\d)(?=.*[a-zA-Z]).{8,20})$')],
      updateOn: 'blur'
    });
    this.form = new FormGroup({
      'password_1': this.passwordFirst,
      'password_2': new FormControl(null, {
        validators: [Validators.required, this.unmatchingPasswords.bind(this)]
      }),
    });
  }

  unmatchingPasswords(password_2: FormControl): { [s: string]: boolean } {
    if (this.passwordFirst.value === password_2.value) {
      return null;
    }
    return {'passwordsDiffer': true};
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  // TODO: refactor after api.
  onSubmit() {
    console.log(this.form);
    if (this.form.valid) {
      const password = this.passwordFirst.value;
      this.logger.debug(this, 'Attempt to submit new password: ' + password);
      this.settingsService.updateMainPassword(password)
        .subscribe((event: HttpEvent<Object>) => {
            if (event.type === HttpEventType.Sent) {
              this.logger.debug(this, 'Password is successfully updated: ' + password);
              this.statusMessage = this.translateService.instant('Your password is successfully updated!');
              this.form.reset();
            }
          },
          err => {
            const status = err['status'];
            if (status >= 400) {
              this.logger.info(this, 'Failed to update user password: ' + password);
              this.statusMessage = this.translateService.instant('Failed to update your password!');
            }
          });
      this.notificationService.message.emit({
        iconLink: './assets/img/shield.svg',
        type: 'primary',
        message: this.translateService.instant('Your password is successfully updated!')
      });
    } else {
      this.notificationService.message.emit({
        iconLink: './assets/img/shield.svg',
        type: 'error',
        message: this.translateService.instant('Failed to update your password!')
      });
    }
  }

  getInputType() {
    return this.isPasswordVisible ? 'text' : 'password';
  }
}
