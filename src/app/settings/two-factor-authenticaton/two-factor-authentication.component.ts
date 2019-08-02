import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../shared/services/popup.service';
import { LoggingService } from '../../shared/services/logging.service';
import { SettingsService } from '../settings.service';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { GoogleAuthenticatorService } from '../../popups/two-factor-popup/google/google-authenticator.service';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as fromCore from '../../core/reducers';

@Component({
  selector: 'app-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.css'],
})
export class TwoFactorAuthenticationComponent implements OnInit {
  public isGoogleTwoFaEnabled = false;
  GAEnabled$: Observable<boolean>;
  loading$: Observable<boolean>;

  constructor(
    private popupService: PopupService,
    private logger: LoggingService,
    private userService: UserService,
    private authService: AuthService,
    private store: Store<fromCore.State>,
    private googleService: GoogleAuthenticatorService
  ) {}

  ngOnInit() {
    this.GAEnabled$ = this.store.pipe(select(fromCore.getGAStatus));
    this.loading$ = this.store.pipe(select(fromCore.getGALoading));
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
      // this.googleService.sendMePincode().subscribe(res => {
      //     console.log(res);
      //   },
      //   error1 => {
      //     console.log(error1);
      //   });
    }
  }
}
