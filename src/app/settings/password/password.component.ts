import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoggingService} from '../../shared/services/logging.service';
import {SettingsService} from '../settings.service';
import {TranslateService} from '@ngx-translate/core';
import {UtilsService} from 'app/shared/services/utils.service';
import {PopupService} from 'app/shared/services/popup.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  form: FormGroup;
  passwordCurrent: FormControl;
  passwordFirst: FormControl;
  passwordSecond: FormControl;
  isPassword1Visible: boolean = false;
  isPassword2Visible: boolean = false;
  isPasswordCurrVisible: boolean = false;

  statusMessage: string;
  loading: boolean = false;

  constructor(private logger: LoggingService,
              private popupService: PopupService,
              private settingsService: SettingsService,
              private utilsService: UtilsService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.statusMessage = '';
    this.passwordCurrent = new FormControl('', {
      validators: [
        Validators.required,
        // Validators.minLength(8),
        // Validators.maxLength(40),
        // this.utilsService.passwordCombinationValidator()
      ]
    });
    this.passwordFirst = new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        this.utilsService.passwordCombinationValidator(),
      ]
    });
    this.passwordSecond = new FormControl('', {
      validators: [
        // Validators.required,
        // Validators.minLength(8),
        // Validators.maxLength(40),
        // this.utilsService.passwordCombinationValidator(),
        this.utilsService.passwordMatchValidator(this.passwordFirst)
      ]
    });

    this.form = new FormGroup({
      'current_password': this.passwordCurrent,
      'password_1': this.passwordFirst,
      'password_2': this.passwordSecond,
    });
    this.observeForm();
  }

  // TODO: refactor after api.
  onSubmit() {
    this.showFormErrors();
    if (this.form.valid) {
      const cur_password = this.passwordCurrent.value || '';
      const password = this.passwordFirst.value;
      this.logger.debug(this, 'Attempt to submit new password: ' + password);
      this.loading = true;
      this.settingsService.updateMainPassword(cur_password, password)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (event) => {
            this.logger.debug(this, 'Password is successfully updated: ' + password);
            this.form.reset();
            this.popupService.toggleChangedPasswordPopup(true);
            this.loading = false;
          },
          err => {
            const status = err['status'];
            if (status === 400) {
              this.logger.info(this, 'Failed to update user password: ' + password);
              this.passwordCurrent.setErrors({'wrong_password': true})
            }
            this.loading = false;
          }
        );
    }
  }

  observeForm() {
    this.firstPassword.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        if (!this.secondPassword.touched) {
          return;
        }
        this.secondPassword.updateValueAndValidity();
      })
  }

  showFormErrors() {
    this.secondPassword.markAsTouched();
    this.firstPassword.markAsTouched();
    this.currentPassword.markAsTouched();
    this.secondPassword.updateValueAndValidity();
    this.firstPassword.updateValueAndValidity();
    this.currentPassword.updateValueAndValidity();
  }

  get currentPassword() {
    return this.form.get('current_password');
  }
  get firstPassword() {
    return this.form.get('password_1');
  }
  get secondPassword() {
    return this.form.get('password_2');
  }

  currentPasswordInput() {
    if (this.firstPassword.touched)  this.form.get('password_1').markAsUntouched();
    if (this.secondPassword.touched)  this.form.get('password_2').markAsUntouched();
  }

  firstPasswordInput() {
    if (this.secondPassword.touched)  this.form.get('password_2').markAsUntouched();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
