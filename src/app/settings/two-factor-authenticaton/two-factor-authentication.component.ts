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

  constructor(private popupService: PopupService,
              private logger: LoggingService) {
  }

  ngOnInit() {

  }

  updateAuthProviderSettings(value: string) {
    this.logger.debug(this, 'Provider settings is invoked for ' + value);
    this.popupService.showTFAPopup(value);
  }

  openLogin() {
    this.isLoginOpen = !this.isLoginOpen;
  }

  getSelectOptions(): string [] {
    const array: string[] = [];
    array.push('By Google', 'By SMS', 'Telegram', 'Disable');
    return array;
  }

  openWithdrawal() {
    this.isWithdrawalOpen = !this.isWithdrawalOpen;
  }

  openTransfer() {
    this.isTransferOpen = !this.isTransferOpen;
  }
}
