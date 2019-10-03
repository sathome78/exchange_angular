import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../shared/services/popup.service';
import { LoggingService } from '../../shared/services/logging.service';
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
    private store: Store<fromCore.State>
  ) {}

  ngOnInit() {
    this.GAEnabled$ = this.store.pipe(select(fromCore.getIs2faEnabled));
    this.loading$ = this.store.pipe(select(fromCore.getIs2faStatusLoading));
  }

  updateAuthProviderSettings(enabled: boolean) {
    this.logger.debug(this, 'Provider settings is invoked for GOOGLE');
    if (enabled) {
      this.popupService.showTFAPopup('GOOGLE');
    } else {
      this.popupService.showTFAPopup('GOOGLE_DISABLED');
    }
  }
}
