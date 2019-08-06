import { Component, OnInit, OnDestroy } from '@angular/core';
import { OnNextStep, PopupService } from '../../../../shared/services/popup.service';
import { GoogleAuthenticatorService } from '../google-authenticator.service';
import { ITwoFaResponseDto, TwoFaResponseDto } from '../2fa-response-dto.model';
import { AuthService } from '../../../../shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromCore from '../../../../core/reducers';

@Component({
  selector: 'app-google-step-two',
  templateUrl: './google-step-two.component.html',
  styleUrls: ['./google-step-two.component.scss'],
})
export class GoogleStepTwoComponent implements OnInit, OnNextStep, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  secretCode = '';
  statusMessage = '';
  public userInfo: ParsedToken;

  constructor(
    private popupService: PopupService,
    private googleService: GoogleAuthenticatorService,
    private translateService: TranslateService,
    private store: Store<fromCore.State>,
    private authService: AuthService
  ) {
    this.store
      .pipe(select(fromCore.getUserInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userInfo: ParsedToken) => {
        this.userInfo = userInfo;
      });
  }

  ngOnInit() {
    this.googleService
      .getGoogleTwoFaSecretHash()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (dto: TwoFaResponseDto) => {
          console.log(dto);
          this.secretCode = dto.message;
          if (dto.error) {
            this.statusMessage = dto.error;
          }
        },
        err => {
          this.statusMessage = this.translateService.instant('Failed to get google url');
          console.error(err);
        }
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onNextStep() {
    this.popupService.moveNextStep();
  }

  getGoogleAuthenticatorUrl(): string {
    if (this.userInfo && this.userInfo.username) {
      const test = environment.production ? '' : ` (Use api ${environment.apiUrl}) `;
      return (
        'https://zxing.org/w/chart?cht=qr&chs=250x250&chld=M&choe=UTF-8&chl=otpauth://totp/Exrates:' +
        test +
        this.userInfo.username +
        '?secret=' +
        this.secretCode
      );
    } else {
      console.error('username = ', this.userInfo.username);
    }
    // return 'otpauth://totp/%s:%s?secret=%s&issuer=%s'
  }
}
