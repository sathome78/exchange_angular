import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getLanguage, State } from 'app/core/reducers';
import { Subject, Observable } from 'rxjs';
import * as fromCore from '../core/reducers';
import { PopupService } from 'app/shared/services/popup.service';
import { takeUntil } from 'rxjs/operators';
import { IEOServiceService } from '../shared/services/ieoservice.service';
import { KycIEOModel } from './models/ieo-kyc.model';
import { ActivatedRoute, Router } from '@angular/router';
import { IEOItem } from 'app/model/ieo.model';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ieo',
  templateUrl: './ieo.component.html',
  styleUrls: ['./ieo.component.scss'],
})
export class IEOComponent implements OnInit, OnDestroy {
  public isAuthenticated: boolean;
  public stage = {
    PENDING: 'PENDING',
    RUNNING: 'RUNNING',
    TERMINATED: 'TERMINATED',
    SUCCEEDED: 'SUCCEEDED',
    FAILED: 'FAILED',
  };

  public lang$: Observable<string>;
  public IEOSub$: Observable<IEOItem>;
  public AuthSub$: Observable<boolean>;
  public currentStage: string = null;
  public showNoReqs = false;
  public showBuy = false;
  public showPolicy = false;
  public showSuccess = false;
  public showWait = false;
  public showSorry = false;
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  public requirements: KycIEOModel = null;
  public verificationStatus = false;
  public IEOId: string;
  public IEOData: IEOItem = new IEOItem();
  public userBalanceBTC = 0;
  public ieoLoading = true;
  public endTimer: any = null;
  public loadingBuy = false;
  private _firstLoadedStatus: string = null;

  constructor(
    private store: Store<State>,
    private readonly translate: TranslateService,
    private popupService: PopupService,
    private route: ActivatedRoute,
    private router: Router,
    private ieoService: IEOServiceService
  ) {
    this.lang$ = this.store.pipe(select(getLanguage));

    this.route.paramMap.subscribe(params => {
      this.IEOId = params.get('id');
      if (isNaN(+this.IEOId)) {
        return this.router.navigate(['/ieo']);
      }
      this.IEOSub$ = this.ieoService.getIEO(this.IEOId);
      this.AuthSub$ = this.store.pipe(select(fromCore.getIsAuthenticated));
      this.IEOSub$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((res: IEOItem) => {
        if (!res) {
          return this.router.navigate(['/ieo']);
        }
        this.IEOData = res;
        this.ieoLoading = false;
        this.currentStage = res.status;
        if (!this._firstLoadedStatus) {
          this._firstLoadedStatus = res.status;
        }
        if (this.currentStage === this.stage.RUNNING) {
          this.setEndIEOTimer();
        }
        this.handleTestIEO(res);
      });
      this.AuthSub$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((isAuth: boolean) => {
        this.isAuthenticated = isAuth;
        if (isAuth) {
          this.ieoService
            .checkKYC(this.IEOId)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe((res: KycIEOModel) => {
              if (res) {
                this.requirements = res;
                this.verificationStatus = Object.values(res).every(i => i);
                // this.requirements = new KycIEOModel(false, false, false);
              }
            });
        }
      });
    });
  }
  ngOnInit() {
    window.scrollTo(0, 0);
    // uncomment when the translation is ready
    this.lang$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(lang => this.translate.use(lang));
  }
  onLogin() {
    this.popupService.showMobileLoginPopup(true);
  }

  handleTestIEO(data: IEOItem) {
    if (
      data.multiplyProcessing &&
      data.status === this.stage.TERMINATED &&
      this._firstLoadedStatus !== this.stage.TERMINATED
    ) {
      this.toggleWait(false);
      this.toggleSorry(true);
    }
  }

  toggleNoReqs(flag: boolean) {
    this.showNoReqs = flag;
  }

  toggleBuy(flag: boolean) {
    this.showBuy = flag;
  }

  togglePolicy(flag: boolean) {
    this.showPolicy = flag;
  }

  toggleSuccess(flag: boolean) {
    this.showSuccess = flag;
  }
  toggleWait(flag: boolean) {
    this.showWait = flag;
  }

  toggleSorry(flag: boolean) {
    this.showSorry = flag;
  }

  confirmBuy(amount) {
    this.loadingBuy = true;
    this.ieoService
      .buyTokens({
        currencyName: this.IEOData.currencyName,
        amount: amount + '',
      })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.toggleBuy(false);
        if (this.IEOData.multiplyProcessing && this.currentStage === this.stage.RUNNING) {
          this.toggleWait(true);
        } else {
          this.toggleSuccess(true);
        }
        this.loadingBuy = false;
      }, err => {
        this.loadingBuy = false;
      });
  }

  agreeWithPolicy() {
    this.ieoService
      .setPolicy(this.IEOData.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.togglePolicy(false);
        this.requirements = { ...this.requirements, policyCheck: true };
      });
  }

  onBuy() {
    if (this.stage.PENDING === this.currentStage) {
    } else if (this.stage.RUNNING === this.currentStage) {
      if (!this.requirements.kycCheck) {
        this.toggleNoReqs(true);
      } else if (!this.requirements.policyCheck) {
        this.togglePolicy(true);
      } else {
        this.toggleBuy(true);
      }
    } else if (this.stage.SUCCEEDED === this.currentStage || this.stage.FAILED === this.currentStage) {
    }
  }

  checkRequirements() {
    if (!this.requirements.countryCheck || !this.requirements.kycCheck || !this.requirements.policyCheck) {
      return false;
    }
    return true;
  }

  onRefreshIEOStatus() {
    this.ieoService
      .refreshIEOStatus()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {});
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    window.onscroll = () => {};
  }

  setEndIEOTimer() {
    if (this.endTimer) {
      clearTimeout(this.endTimer);
    }
    const d = this.IEOData.endDate;
    const endDate: moment.Moment = moment
      .utc({
        y: d.year,
        M: d.monthValue - 1,
        d: d.dayOfMonth,
        h: d.hour,
        m: d.minute,
        s: d.second,
      })
      .local();
    const current_date: moment.Moment = moment();
    const diff: number = endDate.diff(current_date);
    this.endTimer = setTimeout(() => {
      this.onRefreshIEOStatus();
    }, diff);
  }

  bannerClick() {
    if (!this.isAuthenticated) {
      this.onLogin();
    } else {
      this.router.navigate(['/settings/verification']);
    }
  }

  public get showContent() {
    return environment.showContent;
  }
}
