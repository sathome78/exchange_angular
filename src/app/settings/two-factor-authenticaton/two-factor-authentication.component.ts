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


  private isLoginNotificationEnabled: boolean;
  private isWithdrawalNotificationEnabled: boolean;
  private isTransferNotificationEnabled: boolean;

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
    this.isLoginNotificationEnabled = state;
    if (provider === 'GOOGLE') {

    }
  }

  toggleWithdrawalNotification(provider: string, state: boolean) {
    this.isWithdrawalNotificationEnabled = state;
    if (provider === 'GOOGLE') {

    }
  }

  toggleInnerTransferNotification(provider: string, state: boolean) {
    this.isTransferNotificationEnabled = state;
    if (provider === 'GOOGLE') {

    }
  }
}
