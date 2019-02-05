import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopupService} from '../../shared/services/popup.service';
import {UserVerificationService} from '../../shared/services/user-verification.service';
import {SettingsService} from '../settings.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NOT_VERIFIED, LEVEL_ONE, LEVEL_TWO} from '../../shared/constants';
import {AuthService} from '../../shared/services/auth.service';
import {select, Store} from '@ngrx/store';
import {getVerificationStatus, State} from '../../core/reducers';
import {SetVerificationStatusAction} from '../../core/actions/core.actions';
import * as coreAction from '../../core/actions/core.actions';

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
              private store: Store<State>,
              ) {}

  ngOnInit() {
    this.store.pipe(select(getVerificationStatus))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.verificationStatus = res as string;
        console.log(res);
    });

    this.popupService
      .getKYCPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        if (!value) {
          this.store.dispatch(new coreAction.LoadVerificationStatusAction());
        }
      });
     this.showComponent = this.authService.getUsername().match(this.pattern) ? true : false;
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
    if (level === 1 && this.verificationStatus === NOT_VERIFIED || level === 2 && this.verificationStatus === LEVEL_ONE ) {
      this.popupService.showKYCPopup(1);
    }
  }
}
