import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopupService} from '../../shared/services/popup.service';
import {UtilsService} from '../../shared/services/utils.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {NewsService} from '../../shared/services/news.service';
import {Subject} from 'rxjs';
import {AuthService} from '../../shared/services/auth.service';
import {Store, select} from '@ngrx/store';
import {State} from '../../core/reducers';
import * as fromCore from '../../core/reducers';

@Component({
  selector: 'app-news-subscribe-popup',
  templateUrl: './news-subscribe-popup.component.html',
  styleUrls: ['./news-subscribe-popup.component.scss']
})
export class NewsSubscribePopupComponent implements OnInit, OnDestroy {

  public emailForm: FormGroup;
  public resErrorMesage = '';
  public isAuthenticated = false;
  public userInfo: ParsedToken;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public popupService: PopupService,
    private utilsService: UtilsService,
    private authService: AuthService,
    private store: Store<State>,
    private newsService: NewsService
  ) {

    this.store
      .pipe(select(fromCore.getIsAuthenticated))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
      });
    this.store.pipe(select(fromCore.getUserInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userInfo: ParsedToken) => {
        this.userInfo = userInfo;
      })

  }

  ngOnInit() {
    this.initEmailForm();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  closeSubPopup() {
    this.popupService.toggleNewsSubscribePopup(false);
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

  get emailControl() {
    return this.emailForm.get('email');
  }

  emailSubscribe() {
    this.resErrorMesage = '';
    if (this.isAuthenticated && this.userInfo && this.userInfo.username) {
      this.sendEmail(this.userInfo.username);
    } else {
      if (this.emailForm.valid) {
        this.sendEmail(this.emailControl.value);
      }
    }
  }

  sendEmail(email: string) {
    this.newsService.subscribeToPartnerNews(email)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.popupService.toggleNewsSubscribePopup(false);
        this.popupService.toggleNewsThankYouPopup(true);
      }, error => {
        if (error.status !== 400) {
          this.resErrorMesage = 'Service is temporary unavailable, please try again later.';
        }
      });
  }
}
