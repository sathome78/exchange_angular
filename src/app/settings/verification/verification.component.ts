import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopupService} from '../../shared/services/popup.service';
import {UserVerificationService} from '../../shared/services/user-verification.service';
import {SettingsService} from '../settings.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NOT_VERIFIED, LEVEL_ONE, LEVEL_TWO} from '../../shared/constants';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public NOT_VERIFIED = NOT_VERIFIED;
  public LEVEL_ONE = LEVEL_ONE;
  public LEVEL_TWO = LEVEL_TWO;
  public verificationStatus = NOT_VERIFIED;
  public pattern = 'upholding.biz'
  public showComponent = false;

  constructor(private popupService: PopupService,
              private verificationService: UserVerificationService,
              private authService: AuthService,
              private settingsService: SettingsService,
              ) { }

  ngOnInit() {
    this.getVerificationStatus();
    this.popupService
      .getKYCPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        if (!value) {
          this.getVerificationStatus();
        }
      });
     this.showComponent = this.authService.getUsername().match(this.pattern) ? true : false;
  }

  getVerificationStatus() {
    this.settingsService.getCurrentVerificationStatusKYC()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.verificationStatus = res as string;
        console.log(res);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onOpenIdentityPopup(mode: string) {
    this.verificationService.setVerificationMode(mode);
    this.popupService.showIdentityPopup(mode);
  }

  onOpenKYCPopup(step: number) {
    if (step === 1 && this.verificationStatus === NOT_VERIFIED) {
      this.popupService.showKYCPopup(step);
    }
  }
}
