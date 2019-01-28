import {Component, OnInit} from '@angular/core';
import {PopupService} from '../../shared/services/popup.service';
import {LoggingService} from '../../shared/services/logging.service';
import {SettingsService} from '../settings.service';
import {UserService} from '../../shared/services/user.service';
import {AuthService} from '../../shared/services/auth.service';
import {GoogleAuthenticatorService} from '../../popups/two-factor-popup/google/google-authenticator.service';

@Component({
  selector: 'app-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.css']
})
export class TwoFactorAuthenticationComponent implements OnInit {

  public isGoogleTwoFaEnabled = false;

  constructor(private popupService: PopupService,
              private logger: LoggingService,
              private userService: UserService,
              private authService: AuthService,
              private googleAuthService: GoogleAuthenticatorService) {
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.userService.getUserGoogleLoginEnabled(this.authService.getUsername())
        .subscribe(result => {
            console.log(result);
            this.isGoogleTwoFaEnabled = result;
          },
          err => console.log(err));
    }
  }

  private update(state: boolean): void {
    // this.settingsService.updateUserNotificationSettings(state).subscribe(resp => console.log(resp),
    //   err => console.log(err));
  }

  updateAuthProviderSettings(enabled: boolean) {
    this.logger.debug(this, 'Provider settings is invoked for GOOGLE');
    if (enabled) {
      this.popupService.showTFAPopup('GOOGLE');
    } else {
      this.popupService.showTFAPopup('GOOGLE_DISABLED');
      this.googleAuthService.sendMePincode();
    }
  }

}
