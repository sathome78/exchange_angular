import {Component, OnInit} from '@angular/core';
import {PopupService} from '../../services/popup.service';
import {LoggingService} from '../../services/logging.service';
import {SettingsService} from '../settings.service';
import {NotificationUserSetting} from './notification-user-setting.model';

@Component({
  selector: 'app-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.css']
})
export class TwoFactorAuthenticationComponent implements OnInit {

  private isLoginOpen: boolean;
  private isWithdrawalOpen: boolean;
  private isTransferOpen: boolean;


  // isLoginChecked = false;
  // isWithdrawalChecked = false;
  // isInnerTransferChecked = false;
  //
  // isLoginNotificationDisabled = true;
  // isWithdrawalNotificationDisabled = true;
  // isTransferNotificationDisabled = true;

  isLoginGoogleNotificationEnabled = false;
  isWithdrawalGoogleNotificationEnabled = false;
  isTransferGoogleNotificationEnabled = false;

  constructor(private popupService: PopupService,
              private logger: LoggingService,
              private settingsService: SettingsService) {
  }

  // LOGIN: false
  // TRANSFER: true
  // WITHDRAW: true
  ngOnInit() {
    this.settingsService.getUserTwoFaNotificationSettings()
      .subscribe(settings => {
          this.isLoginGoogleNotificationEnabled = settings['LOGIN'];
          this.isWithdrawalGoogleNotificationEnabled = settings['WITHDRAW'];
          this.isTransferGoogleNotificationEnabled = settings['TRANSFER'];
      },
        err => console.log(err));

  }

  toggleLoginGoogleNotification() {
    this.isLoginGoogleNotificationEnabled = !this.isLoginGoogleNotificationEnabled;
    const settings = NotificationUserSetting
      .builder()
      .withLogin().build();
    if (this.isLoginGoogleNotificationEnabled) {
      settings.byGoogle();
    } else {
      settings.disable();
    }
    this.update(settings);
  }

  toggleWithdrawalGoogleNotification() {
    this.isWithdrawalGoogleNotificationEnabled = !this.isWithdrawalGoogleNotificationEnabled;
    const settings = NotificationUserSetting
      .builder()
      .withWithdraw()
      .build();
    if (this.isWithdrawalGoogleNotificationEnabled) {
      settings.byGoogle();
    } else {
      settings.disable();
    }
    this.update(settings);
  }

  toggleTransferGoogleNotification() {
    this.isTransferGoogleNotificationEnabled = !this.isTransferGoogleNotificationEnabled;
    const settings = NotificationUserSetting
      .builder()
      .withTransfer().build();
    if (this.isTransferGoogleNotificationEnabled) {
      settings.byGoogle();
    } else {
      settings.disable();
    }
    this.update(settings);
  }

  private update(setting: NotificationUserSetting): void {
    this.settingsService.updateUserNotificationSettings(setting).subscribe(resp => console.log(resp),
      err => console.log(err));
  }

  updateAuthProviderSettings(value: string) {
    this.logger.debug(this, 'Provider settings is invoked for ' + value);
    this.popupService.showTFAPopup(value);
  }


  getSelectOptions(): string [] {
    const array: string[] = [];
    array.push('By Google', 'Disabled');
    return array;
  }

  openLogin() {
    this.closeDropdowns();
    this.isLoginOpen = !this.isLoginOpen;
  }

  openWithdrawal() {
    this.closeDropdowns();
    this.isWithdrawalOpen = !this.isWithdrawalOpen;
  }

  openTransfer() {
    this.closeDropdowns();
    this.isTransferOpen = !this.isTransferOpen;
  }

  closeDropdowns() {
  this.isLoginOpen = false;
  this.isWithdrawalOpen = false;
  this.isTransferOpen = false;
  }

}
