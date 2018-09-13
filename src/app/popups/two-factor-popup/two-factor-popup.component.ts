import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopupService} from '../../services/popup.service';
import {generate, Subscription} from 'rxjs';
import {LoggingService} from '../../services/logging.service';

@Component({
  selector: 'app-two-factor-popup',
  templateUrl: './two-factor-popup.component.html',
  styleUrls: ['./two-factor-popup.component.scss']
})
export class TwoFactorPopupComponent implements OnInit {

  google = 'GOOGLE';
  sms = 'SMS';
  telegram = 'TELEGRAM';
  provider: string;

  constructor(private popupService: PopupService,
              private logger: LoggingService) {
  }

  ngOnInit() {
    this.provider = this.popupService.getTFAProvider();
    this.logger.debug(this, 'Provider on init is: ' + this.provider);
  }

  closePopup() {
    this.logger.debug(this, 'Attempt to close popup ');
    this.popupService.closeTFAPopup();
  }

  getValue(value: any) {
    this.logger.debug(this, 'By TFA subscription received: ' + value);
    if (value === this.google || value === this.sms || value === this.telegram) {
      this.provider = value;
    }
  }
}
