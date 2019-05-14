import {Component, OnDestroy, OnInit} from '@angular/core';
import {IEOItem} from '../../../model/ieo.model';
import {Observable, Subject} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {getVerificationStatus, State} from '../../../core/reducers';
import {takeUntil} from 'rxjs/operators';
import * as fromCore from '../../../core/reducers';
import {KYC_STATUS} from '../../../shared/constants';
import {PopupService} from '../../../shared/services/popup.service';
import {Router} from '@angular/router';
import {data} from '../../JSONData';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilsService} from '../../../shared/services/utils.service';
import {IEOServiceService} from '../../../shared/services/ieoservice.service';
import {KycIEOModel} from '../../models/ieo-kyc.model';
import {ThankPopupModel} from '../../../shared/models/thank-popup-model';
import {AuthService} from '../../../shared/services/auth.service';
import * as coreAction from '../../../core/actions/core.actions';

@Component({
  selector: 'app-common-ieo',
  templateUrl: './common-ieo.component.html',
  styleUrls: ['./common-ieo.component.scss']
})
export class CommonIEOComponent implements OnInit, OnDestroy {

  public ieoList: IEOItem[];
  public emailForm: FormGroup;
  public showBuyIEO = false;
  public verificationStatus: string;
  public isSubmited = false;
  public showPolicy = false;
  public showNoReqs = false;
  public isEmailSubscribe = false;
  public isRedirectToTelegram = false;
  public isAuthenticated: boolean;
  public AuthSub$: Observable<boolean>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public KYC_STATUS = KYC_STATUS;
  public requirements: KycIEOModel = new KycIEOModel(null, null, null);
  public buyIEOData;
  public showSuccessIEO = false;
  private thakPopupOpen: ThankPopupModel;

  constructor(
    private store: Store<State>,
    private popupService: PopupService,
    private utilsService: UtilsService,
    private ieoService: IEOServiceService,
    private authService: AuthService,
    private router: Router
  ) {
    this.AuthSub$ = this.store.pipe(select(fromCore.getIsAuthenticated));
  }

  ngOnInit() {
    this.subscribeToIEOList();
    this.getIEOList();
    this.initEmailForm();
    this.getKYCVerificationStatus();
    this.checkSubscribe();
    this.thakPopupOpen = {
      isOpen: true,
      title: 'Thank you!',
      subTitle: 'You have successfully subscribed for IEO news'
    };
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  subscribeToIEOList(): void {
    this.ieoService.getListIEO()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: IEOItem[]) => {
        this.store.dispatch(new coreAction.SetIEOListAction(res))
      });
  }
  getIEOList(): void {
    this.store.pipe(select(fromCore.getIEOList))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.ieoList = (res as IEOItem[] || []).reverse();
      });
  }

  getKYCVerificationStatus() {
    this.AuthSub$.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isAuth: boolean) => {
        this.isAuthenticated = isAuth;
        if (isAuth) {
          this.store.pipe(select(getVerificationStatus))
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
              this.verificationStatus = res;
            });
        }
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
      email: new FormControl('', { validators: [
          Validators.required, this.utilsService.emailValidator(),
          this.utilsService.specialCharacterValidator(),
          Validators.maxLength(40)
        ]}),
    });
  }

  subEmailNotification() {
    // this.popupService.getThankYouPopupListener().next(this.thakPopupOpen);
    this.isSubmited = true;
    if (this.emailForm.valid) {
       this.ieoService.ieoEmailSubscription(this.emailControl.value)
         .pipe(takeUntil(this.ngUnsubscribe))
         .subscribe(res => {
           this.emailForm.reset();
           this.popupService.getThankYouPopupListener().next(this.thakPopupOpen);
           this.checkSubscribe();
         }, error => {
           this.emailForm.reset();
         });
    }
  }

  redirectToTelegram() {
    if (this.isAuthenticated) {
      this.ieoService.ieoTelegramRedirect(this.authService.getUsername())
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
    this.ieoService.buyTokens({
      currencyName: this.buyIEOData.currencyName,
      amount: amount + '',
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.closeBuyIEO();
        this.openSuccessIEO();
      });
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
    }
  }

  checkSubscribe() {
    if (this.isAuthenticated) {
      this.ieoService.ieoCheckSubscribe(this.authService.getUsername())
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
    this.ieoService.checkKYC(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: KycIEOModel) => {
        if (res) {
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

  agreeWithPolicy() {
    this.ieoService.setPolicy()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.togglePolicy(false);
        this.requirements = {...this.requirements, policyCheck: true};
        this.openBuyPopup();
      });
  }

  get boughtAmount() {
    return (IEOData) => (IEOData.amount - IEOData.availableAmount) || 0;
  }

  get sessionSupply() {
    return (IEOData) => (IEOData.amount * IEOData.rate) || 0;
  }

  get boughtAmountPer() {
    return  (IEOData) => {
      const a = (this.boughtAmount(IEOData) / (IEOData.amount / 100)) || 0
      return a.toFixed(2);
    }
  }
}
