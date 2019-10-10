import { Component, OnDestroy, OnInit } from '@angular/core';
import { IEOItem } from '../../../model/ieo.model';
import { Observable, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import * as fromCore from '../../../core/reducers';
import { KYC_STATUS } from '../../../shared/constants';
import { PopupService } from '../../../shared/services/popup.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from '../../../shared/services/utils.service';
import { IEOServiceService } from '../../../shared/services/ieoservice.service';
import { KycIEOModel } from '../../models/ieo-kyc.model';
import { ThankPopupModel } from '../../../shared/models/thank-popup-model';
import { AuthService } from '../../../shared/services/auth.service';
import * as coreAction from '../../../core/actions/core.actions';
import * as moment from 'moment';

@Component({
  selector: 'app-common-ieo',
  templateUrl: './common-ieo.component.html',
  styleUrls: ['./common-ieo.component.scss'],
})
export class CommonIEOComponent implements OnInit, OnDestroy {
  public ieoList: IEOItem[];
  public cacheIeoList: IEOItem[] = [];
  public emailForm: FormGroup;
  public showBuyIEO = false;
  public verificationStatus: string;
  public isSubmited = false;
  public showPolicy = false;
  public showNoReqs = false;
  public isEmailSubscribe = false;
  public isRedirectToTelegram = false;
  public isAuthenticated: boolean;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public KYC_STATUS = KYC_STATUS;
  public requirements: KycIEOModel = new KycIEOModel(null, null, null);
  public buyIEOData;
  public showSuccessIEO = false;
  public showWait = false;
  public showSorry = false;
  private thakPopupOpen: ThankPopupModel;
  public userInfo: ParsedToken;
  public _firstLoadedStatus;
  public stage = {
    PENDING: 'PENDING',
    RUNNING: 'RUNNING',
    TERMINATED: 'TERMINATED',
    SUCCEEDED: 'SUCCEEDED',
    FAILED: 'FAILED',
  };

  constructor(
    private store: Store<fromCore.State>,
    private popupService: PopupService,
    private utilsService: UtilsService,
    private ieoService: IEOServiceService,
    private authService: AuthService,
    private router: Router
  ) {
    this.store
      .pipe(select(fromCore.getUserInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userInfo: ParsedToken) => {
        this.userInfo = userInfo;
      });
    this.store
      .pipe(select(fromCore.getIsAuthenticated))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isAuth: boolean) => {
        this.isAuthenticated = isAuth;
        if (isAuth) {
          this.checkSubscribe();

          this.store
            .pipe(select(fromCore.getVerificationStatus))
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
              this.verificationStatus = res;
            });
        }
      });
  }

  ngOnInit() {
    this.subscribeToIEOList();
    this.getIEOList();
    this.initEmailForm();
    this.thakPopupOpen = {
      isOpen: true,
      title: 'Thank you!',
      subTitle: 'You have successfully subscribed for IEO news',
    };
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  subscribeToIEOList(): void {
    this.ieoService
      .getListIEO()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: IEOItem[]) => {
        this.store.dispatch(new coreAction.SetIEOListAction(res));
      });
  }
  getIEOList(): void {
    this.store
      .pipe(select(fromCore.getIEOList))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.ieoList = [
          ...(res as IEOItem[]).sort((a, b) => {
            const aT = this.getDateValue(a.startDate);
            const bT = this.getDateValue(b.startDate);
            const diff = aT - bT;
            if (diff < 0) {
              return 1;
            }
            if (diff > 0) {
              return -1;
            }
            return 0;
          }),
        ];
        this.handleTestIEO();
      });
  }

  bannerClick() {
    if (!this.isAuthenticated) {
      this.onLogin();
    } else {
      this.router.navigate(['/settings/verification']);
    }
  }

  onLogin() {
    this.popupService.showMobileLoginPopup(true);
  }

  readMore(id: number): void {
    this.router.navigate([`/ieo/${id}`]);
  }

  initEmailForm() {
    this.emailForm = new FormGroup({
      email: new FormControl('', {
        validators: [
          Validators.required,
          this.utilsService.emailValidator(),
        ],
      }),
    });
  }

  subEmailNotification() {
    this.isSubmited = true;
    this.emailForm.get('email').updateValueAndValidity();
    this.emailForm.get('email').markAsTouched();
    if (this.emailForm.valid) {
      this.ieoService
        .ieoEmailSubscription(this.emailControl.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          res => {
            this.emailForm.reset();
            this.popupService.getThankYouPopupListener().next(this.thakPopupOpen);
            this.checkSubscribe();
          },
          error => {
            this.emailForm.reset();
          }
        );
    }
  }

  redirectToTelegram() {
    if (this.isAuthenticated) {
      this.ieoService
        .ieoTelegramRedirect(this.userInfo && this.userInfo.username)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          if (!this.isRedirectToTelegram) {
            this.checkSubscribe();
          }
        });
    }
  }

  get emailControl() {
    return this.emailForm.get('email');
  }

  public closeBuyIEO() {
    this.showBuyIEO = false;
  }

  public confirmBuyIEO(amount) {
    this.ieoService
      .buyTokens({
        currencyName: this.buyIEOData.currencyName,
        amount: amount + '',
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this._firstLoadedStatus = this.buyIEOData.status;
        this.closeBuyIEO();
        if (this.buyIEOData.multiplyProcessing && this.buyIEOData.status === this.stage.RUNNING) {
          this.toggleWait(true);
        } else {
          this.openSuccessIEO();
        }
      });
  }

  public handleTestIEO() {
    if (this.buyIEOData && this.ieoList && this.ieoList.length) {
      const ieo = this.ieoList.find(i => i.id === this.buyIEOData.id);
      if (
        ieo &&
        ieo.multiplyProcessing &&
        ieo.status === this.stage.TERMINATED &&
        this._firstLoadedStatus !== this.stage.TERMINATED
      ) {
        this.toggleWait(false);
        this.toggleSorry(true);
      }
    }
  }

  public openSuccessIEO() {
    this.showSuccessIEO = true;
  }

  closeSuccessIEO() {
    this.showSuccessIEO = false;
  }

  public buyIeo(ieoItem) {
    this.buyIEOData = ieoItem;
    if (this.isAuthenticated) {
      this.checkKYCStatus(ieoItem.id);
    } else {
      this.popupService.showMobileLoginPopup(true);
    }
  }

  checkSubscribe() {
    if (this.isAuthenticated) {
      this.ieoService
        .ieoCheckSubscribe(this.userInfo && this.userInfo.username)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          try {
            this.isEmailSubscribe = (res as any).data.email;
            this.isRedirectToTelegram = (res as any).data.telegram;
          } catch (e) {}
        });
    }
  }

  checkKYCStatus(id) {
    this.ieoService
      .checkKYC(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: KycIEOModel) => {
        if (res) {
          // console.log(res)
          this.requirements = res;
          this.openBuyPopup();
        }
      });
  }

  openBuyPopup() {
    if (!this.requirements.kycCheck) {
      this.toggleNoReqs(true);
    } else if (!this.requirements.policyCheck) {
      this.togglePolicy(true);
    } else {
      this.showBuyIEO = true;
    }
  }

  togglePolicy(flag: boolean) {
    this.showPolicy = flag;
  }

  toggleNoReqs(flag: boolean) {
    this.showNoReqs = flag;
  }

  toggleWait(flag: boolean) {
    this.showWait = flag;
  }

  toggleSorry(flag: boolean) {
    this.showSorry = flag;
  }

  agreeWithPolicy() {
    this.ieoService
      .setPolicy()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.togglePolicy(false);
        this.requirements = { ...this.requirements, policyCheck: true };
        this.openBuyPopup();
      });
  }

  get boughtAmount() {
    return IEOData => IEOData.amount - IEOData.availableAmount || 0;
  }

  get sessionSupply() {
    return IEOData => IEOData.amount * IEOData.rate || 0;
  }

  get boughtAmountPer() {
    return IEOData => {
      const a = this.boughtAmount(IEOData) / (IEOData.amount / 100) || 0;
      return a.toFixed(2);
    };
  }

  public getDateValue(d) {
    if (!d) {
      return 0;
    }
    if (typeof d === 'object') {
      return moment
        .utc({
          y: d.year,
          M: d.monthValue - 1,
          d: d.dayOfMonth,
          h: d.hour,
          m: d.minute,
          s: d.second,
        })
        .valueOf();
    }

    if (typeof d === 'string') {
      return moment.utc(d).valueOf();
    }
  }

  trackByIeo(index, item) {
    return item.id;
  }
}
