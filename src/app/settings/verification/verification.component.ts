import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopupService } from '../../shared/services/popup.service';
import { UserVerificationService } from '../../shared/services/user-verification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getVerificationStatus, State, getUserInfo } from '../../core/reducers';
import { SHUFTI_PRO_KYC_STATUS } from '../../shared/constants';
import { select, Store } from '@ngrx/store';
import * as coreAction from '../../core/actions/core.actions';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
})
export class VerificationComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public ACCEPTED = SHUFTI_PRO_KYC_STATUS.ACCEPTED;
  public PENDING = SHUFTI_PRO_KYC_STATUS.PENDING;
  public verificationStatus: string;
  public userInfo: ParsedToken;
  public pattern = 'upholding.biz';
  public isPublicIdCopied = false;

  constructor(
    private popupService: PopupService,
    private verificationService: UserVerificationService,
    private store: Store<State>
  ) {}

  ngOnInit() {
    this.store
      .pipe(select(getVerificationStatus))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: string) => {
        this.verificationStatus = res;
      });

    this.popupService
      .getKYCPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        if (!value) {
          this.store.dispatch(new coreAction.LoadVerificationStatusAction());
        }
      });

    this.store
      .pipe(select(getUserInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userInfo: ParsedToken) => {
        this.userInfo = userInfo;
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

  onOpenKYCPopup(level: number) {
    if (this.verificationStatus !== this.ACCEPTED) {
      this.popupService.showKYCPopup(1);
    }
  }

  copyPublicId(value) {
    const selBox = document.createElement('textarea');
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
}
