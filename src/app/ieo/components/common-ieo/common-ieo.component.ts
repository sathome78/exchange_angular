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
  public isAuthenticated: boolean;
  public AuthSub$: Observable<boolean>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public KYC_STATUS = KYC_STATUS;
  public requirements: KycIEOModel = new KycIEOModel(null, null, null);
  public buyIEOData;
  public showSuccessIEO = false;

  constructor(
    private store: Store<State>,
    private popupService: PopupService,
    private utilsService: UtilsService,
    private ieoService: IEOServiceService,
    private router: Router
  ) {
    this.AuthSub$ = this.store.pipe(select(fromCore.getIsAuthenticated));
  }

  ngOnInit() {
    this.getIEOList();
    this.initEmailForm();
    this.getKYCVerificationStatus();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getIEOList(): void {
    this.store.pipe(select(fromCore.getIEOList))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        console.log(res)
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
    this.isSubmited = true;
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
}