import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopupService } from '../../shared/services/popup.service';
import { UserVerificationService } from '../../shared/services/user-verification.service';
import { SettingsService } from '../settings.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getVerificationStatus, State, getUserInfo } from '../../core/reducers';
import { NOT_VERIFIED, LEVEL_ONE, LEVEL_TWO } from '../../shared/constants';
import { AuthService } from '../../shared/services/auth.service';
import { select, Store } from '@ngrx/store';
import { SetVerificationStatusAction } from '../../core/actions/core.actions';
import * as coreAction from '../../core/actions/core.actions';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public NOT_VERIFIED = NOT_VERIFIED;
  public LEVEL_ONE = LEVEL_ONE;
  public LEVEL_TWO = LEVEL_TWO;
  public verificationStatus = NOT_VERIFIED;
  public userInfo: ParsedToken;
  public pattern = 'upholding.biz'
  public showComponent = false;
  public isPublicIdCopied = false;

  constructor(private popupService: PopupService,
    private verificationService: UserVerificationService,
    private authService: AuthService,
    private store: Store<State>,
  ) { }

  ngOnInit() {
    this.store.pipe(select(getVerificationStatus))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res && res != 'none') {
          this.verificationStatus = res as string;
        }
      });

    this.popupService
      .getKYCPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        if (!value) {
          this.store.dispatch(new coreAction.LoadVerificationStatusAction());
        }
      });;

    this.store.pipe(select(getUserInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userInfo: ParsedToken) => {
        this.userInfo = userInfo;
      })

    this.showComponent = this.isUpholding();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onOpenIdentityPopup(mode: string) {
    this.verificationService.setVerificationMode(mode);
    this.popupService.showIdentityPopup(mode);
  }

  onOpenKYCPopup(level: number, ) {
    if (level === 1 && this.verificationStatus === NOT_VERIFIED || level === 2 && this.verificationStatus === LEVEL_ONE) {
      this.popupService.showKYCPopup(1);
    }
  }

  copyPublicId(value) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    this.isPublicIdCopied = true;
    document.body.removeChild(selBox);
  }


  isUpholding(): boolean {
    return !!(this.userInfo && this.userInfo.username).match(this.pattern);
  }

}
