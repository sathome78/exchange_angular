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

@Component({
  selector: 'app-common-ieo',
  templateUrl: './common-ieo.component.html',
  styleUrls: ['./common-ieo.component.scss']
})
export class CommonIEOComponent implements OnInit, OnDestroy {

  public ieoList: IEOItem[];
  public emailForm: FormGroup;
  public verificationStatus: string;
  public isSubmited = false;
  public isAuthenticated: boolean;
  public AuthSub$: Observable<boolean>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public KYC_STATUS = KYC_STATUS;

  constructor(
    private store: Store<State>,
    private popupService: PopupService,
    private utilsService: UtilsService,
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
        console.log(res);
        this.ieoList = res;
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
              console.log(res);
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
}
