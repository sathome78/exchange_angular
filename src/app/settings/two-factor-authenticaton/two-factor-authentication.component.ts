import {Component, OnInit} from '@angular/core';
import {PopupService} from '../../services/popup.service';
import {LoggingService} from '../../services/logging.service';

@Component({
  selector: 'app-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.css']
})
export class TwoFactorAuthenticationComponent implements OnInit {

  private isLoginOpen: boolean;
  private isWithdrawalOpen: boolean;
  private isTransferOpen: boolean;


  isLoginNotificationDisabled = true;
  isWithdrawalNotificationDisabled = true;
  isTransferNotificationDisabled = true;

  isLoginGoogleNotificationEnabled = false;
  isWithdrawalGoogleNotificationEnabled = false;
  isTransferGoogleNotificationEnabled = false;

  constructor(private popupService: PopupService,
              private logger: LoggingService) {
  }

  ngOnInit() {

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

  toggleLoginNotification(provider: string, state: boolean) {
    this.isLoginNotificationDisabled = !state;
    if (provider === 'GOOGLE') {
      this.isLoginGoogleNotificationEnabled = state;

    }
  }

  toggleWithdrawalNotification(provider: string, state: boolean) {
    this.isWithdrawalNotificationDisabled = state;
    if (provider === 'GOOGLE') {
      this.isWithdrawalGoogleNotificationEnabled = state;
    }
  }

  toggleInnerTransferNotification(provider: string, state: boolean) {
    this.isTransferNotificationDisabled = state;
    if (provider === 'GOOGLE') {
      this.isTransferGoogleNotificationEnabled = state;

    }
  }

  enableLoginGoogleNotification() {
    this.isLoginNotificationDisabled = false;
    this.isLoginGoogleNotificationEnabled = true;
  }

  disableLoginNotification() {
    this.isLoginNotificationDisabled = true;
    // todo disable google notification
    this.isLoginGoogleNotificationEnabled = false;
  }

  enableWithdrawGoogleNotification() {
    this.isWithdrawalNotificationDisabled = false;
    this.isWithdrawalGoogleNotificationEnabled = true;
  }

  disableWithdrawNotification() {
    this.isWithdrawalNotificationDisabled = true;
    // todo disable google notification
    this.isWithdrawalGoogleNotificationEnabled = false;
  }

  enableTransferGoogleNotification() {
    this.isTransferNotificationDisabled = false;
    this.isTransferGoogleNotificationEnabled = true;
  }

  disableTransferNotification() {
    this.isTransferNotificationDisabled = true;
    // todo disable google notification
    this.isTransferGoogleNotificationEnabled = false;
  }
}
