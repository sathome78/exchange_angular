import {Component, OnInit} from '@angular/core';
import {PopupService} from '../../services/popup.service';
import {LoggingService} from '../../services/logging.service';

@Component({
  selector: 'app-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.css']
})
export class TwoFactorAuthenticationComponent implements OnInit {

  constructor(private popupService: PopupService,
              private logger: LoggingService) {
  }

  ngOnInit() {

  }

  updateAuthProviderSettings(value: string) {
    this.logger.debug(this, 'Provider settings is invoked for ' + value);
    this.popupService.showTFAPopup(value);
  }

}
