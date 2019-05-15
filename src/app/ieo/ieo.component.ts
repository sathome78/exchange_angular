import {Component, OnInit, OnDestroy} from '@angular/core';
import {data} from './JSONData';
import {Store, select} from '@ngrx/store';
import {getLanguage, State} from 'app/core/reducers';
import {Subject, Observable, forkJoin} from 'rxjs';
import * as fromCore from '../core/reducers';
import {PopupService} from 'app/shared/services/popup.service';
import {takeUntil} from 'rxjs/operators';
import {IEOServiceService} from '../shared/services/ieoservice.service';
import {KycIEOModel} from './models/ieo-kyc.model';
import {ActivatedRoute} from '@angular/router';
import {IEOItem} from 'app/model/ieo.model';
import {UserService} from 'app/shared/services/user.service';
import {environment} from 'environments/environment';
import * as moment from 'moment';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-ieo',
  templateUrl: './ieo.component.html',
  styleUrls: ['./ieo.component.scss']
})
export class IEOComponent implements OnInit, OnDestroy{

  public ieoData = data;
  public isAuthenticated: boolean;
  public stage = {
    PENDING: 'PENDING',
    RUNNING: 'RUNNING',
    TERMINATED: 'TERMINATED',
    SUCCEEDED: 'SUCCEEDED',
    FAILED: 'FAILED',
  }

  public lang$: Observable<string>;
  public IEOSub$: Observable<IEOItem>;
  public AuthSub$: Observable<boolean>;
  public currentStage: string = this.stage.PENDING;
  public showNoReqs: boolean = false;
  public showBuy: boolean = false;
  public showPolicy: boolean = false;
  public showSuccess: boolean = false;
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  public requirements: KycIEOModel = new KycIEOModel(null, null, null);
  private IEOId: string;
  public IEOData: IEOItem = new IEOItem();
  public userBalanceBTC: number = 0;
  public ieoLoading: boolean = true;
  public endTimer: any = null;

  constructor(
    private store: Store<State>,
    private readonly translate: TranslateService,
    private popupService: PopupService,
    private route: ActivatedRoute,
    private ieoService: IEOServiceService,
    private userService: UserService,
  ) {
    this.lang$ = this.store.pipe(select(getLanguage));

    this.route.paramMap.subscribe(params => {
      this.IEOId = params.get("id");
      this.IEOSub$ = this.ieoService.getIEO(this.IEOId);
      this.AuthSub$ = this.store.pipe(select(fromCore.getIsAuthenticated));
      this.IEOSub$.pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((res: IEOItem) => {
          this.IEOData = res;
          // this.IEOData.status = 'TERMINATED';
          this.ieoLoading = false;
          this.currentStage = res.status;
          if(this.currentStage === this.stage.RUNNING) {
            this.setEndIEOTimer();
          }
        });
      this.AuthSub$.pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((isAuth: boolean) => {
          this.isAuthenticated = isAuth;
          if(isAuth) {
            this.ieoService.checkKYC(this.IEOId)
              .pipe(takeUntil(this.ngUnsubscribe$))
              .subscribe((res: KycIEOModel) => {
                if(res) {
                  this.requirements = res;
                  // this.requirements = new KycIEOModel(true, true, true);
                };
              })
          }
        })
    })

  }

  ngOnInit() {
    window.scrollTo(0, 0);
    // uncomment when the translation is ready
    // this.lang$
    //   .pipe(takeUntil(this.ngUnsubscribe$))
    //   .subscribe(lang => this.translate.use(lang));
  }

  onLogin() {
    this.popupService.showMobileLoginPopup(true);
  }

  openNoReqs() {
    this.showNoReqs = true;
  }

  closeNoReqs() {
    this.showNoReqs = false;
  }

  openBuy() {
    this.showBuy = true;
  }
  closeBuy() {
    this.showBuy = false;
  }

  openPolicy() {
    this.showPolicy = true;
  }
  closePolicy() {
    this.showPolicy = false;
  }
  openSuccess() {
    this.showSuccess = true;
  }
  closeSuccess() {
    this.showSuccess = false;
  }

  confirmBuy(amount) {
    this.ieoService.buyTokens({
      currencyName: this.IEOData.currencyName,
      amount: amount + '',
    })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.closeBuy();
        this.openSuccess();
      })
  }

  agreeWithPolicy() {
    this.ieoService.setPolicy()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.closePolicy();
        this.requirements = {...this.requirements, policyCheck: true}
      })
  }

  onBuy() {
    if(this.stage.PENDING === this.currentStage) {

    } else if (this.stage.RUNNING === this.currentStage) {
      if(!this.requirements.kycCheck) {
        this.openNoReqs();
      } else if (!this.requirements.policyCheck) {
        this.openPolicy();
      } else {
        this.openBuy();
      }
      // this.openBuy();
    } else if (this.stage.SUCCEEDED === this.currentStage || this.stage.FAILED === this.currentStage) {

    }
  }

  checkRequirements() {
    if(!this.requirements.countryCheck || !this.requirements.kycCheck || !this.requirements.policyCheck) {
      return false;
    }
    return true;
  }

  onRefreshIEOStatus() {
    this.ieoService.refreshIEOStatus()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {});
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    window.onscroll = () => {}
  }

  setEndIEOTimer() {
    if(this.endTimer) {
      clearTimeout(this.endTimer);
    }
    const d = this.IEOData.endDate;
    const endDate: moment.Moment = moment.utc({
      y: d.year, M: d.monthValue - 1, d: d.dayOfMonth, h: d.hour, m: d.minute, s: d.second
    }).local();
    const current_date: moment.Moment = moment();
    const diff: number = endDate.diff(current_date);
    this.endTimer = setTimeout(() => {
      this.onRefreshIEOStatus();
    }, diff);
  }

  public get showContent() {
    return environment.showContent;
  }

}
