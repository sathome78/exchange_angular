import {Component, OnInit} from '@angular/core';
import {PopupService} from '../../services/popup.service';
import {LoggingService} from '../../services/logging.service';
import {SettingsService} from '../settings.service';
import {NotificationUserSetting} from './notification-user-setting.model';
import {GoogleAuthenticatorService} from '../../popups/two-factor-popup/google/google-authenticator.service';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.css']
})
export class TwoFactorAuthenticationComponent implements OnInit {

  public isLoginOpen: boolean;
  public isWithdrawalOpen: boolean;
  public isTransferOpen: boolean;


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
              private userService: UserService,
              private authService: AuthService,
              private settingsService: SettingsService) {
  }

  // LOGIN: false
  // TRANSFER: true
  // WITHDRAW: true
  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.userService.getUserGoogleLoginEnabled(this.authService.getUsername())
        .subscribe(result => {
            this.isLoginGoogleNotificationEnabled = result;
            this.isWithdrawalGoogleNotificationEnabled = result;
            this.isTransferGoogleNotificationEnabled = result;
          },
          err => console.log(err));
    }
  }

  toggle2FaNotification() {
    this.isTransferGoogleNotificationEnabled = !this.isTransferGoogleNotificationEnabled;
    this.isLoginGoogleNotificationEnabled = !this.isLoginGoogleNotificationEnabled;
    this.isWithdrawalGoogleNotificationEnabled = !this.isWithdrawalGoogleNotificationEnabled;
    this.update(this.isWithdrawalGoogleNotificationEnabled);
  }

  private update(state: boolean): void {
    this.settingsService.updateUserNotificationSettings(state).subscribe(resp => console.log(resp),
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
