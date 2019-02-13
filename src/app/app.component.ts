import {Component, OnDestroy, OnInit, enableProdMode} from '@angular/core';
import {PopupService} from './shared/services/popup.service';
import {Router} from '@angular/router';
import {ThemeService} from './shared/services/theme.service';
import {IpAddress, UserService} from './shared/services/user.service';
import {IP_CHECKER_URL, IP_USER_KEY} from './shared/services/http.utils';
import {LoggingService} from './shared/services/logging.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NotificationsService} from './shared/components/notification/notifications.service';
import {NotificationMessage} from './shared/models/notification-message-model';
import {DashboardWebSocketService} from './dashboard/dashboard-websocket.service';
import {AuthService} from './shared/services/auth.service';
import {Subject} from 'rxjs/Subject';
import {takeUntil, withLatestFrom} from 'rxjs/internal/operators';
import {TranslateService} from '@ngx-translate/core';
import {select, Store} from '@ngrx/store';
import * as fromCore from './core/reducers';
import {PopupData} from './shared/interfaces/popup-data-interface';
import * as coreActions from './core/actions/core.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'exrates-front-new';
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public kycStep = 1;
  public popupData: PopupData;

  isTfaPopupOpen = false;
  isIdentityPopupOpen = false;
  isKYCPopupOpen = false;
  isLoginPopupOpen = false;
  isLoginMobilePopupOpen = false;
  isRegistrationMobilePopupOpen = false;
  isRecoveryPasswordPopupOpen = false;
  isRestoredPasswordPopupOpen = false;
  isChangedPasswordPopupOpen = false;
  isAlreadyRestoredPasswordPopupOpen = false;
  isSessionTimeSavedPopupOpen = false;
  isOpenDemoTradingPopup = false;
  isOpenAlreadyRegisteredPopup = false;
  isOpenInfoPopup = false;
  /** notification messages array */
  notificationMessages: NotificationMessage[];

  constructor(public popupService: PopupService,
              private themeService: ThemeService,
              private dashboardWebsocketService: DashboardWebSocketService,
              private authService: AuthService,
              private store: Store<fromCore.State>,
              private http: HttpClient,
              private notificationService: NotificationsService,
              public translate: TranslateService) {
    // this.popupService.getShowTFAPopupListener().subscribe(isOpen => this.isTfaPopupOpen);


    // translate.addLangs(['en', 'ru', 'uk', 'pl']);
    // translate.setDefaultLang('en');
    // const browserLang = translate.getBrowserLang();
    // this.store.dispatch(new ChangeLanguageAction(browserLang.match(/en|ru|uk|pl/) ? browserLang : 'en'));
    // this.store.pipe(select(getLanguage)).subscribe(res => this.translate.use(res));

    this.setIp();

    this.store
      .pipe(select(fromCore.getIsAuthenticated))
      .pipe(withLatestFrom(this.store.pipe(select(fromCore.getUserInfo))))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([isAuth, userInfo]: [boolean, ParsedToken]) => {
        if(isAuth && userInfo) {
          this.authService.setSessionFinishListener(userInfo.expiration);
        } else {
          this.authService.removeSessionFinishListener();
        }
      });
  }

  ngOnInit(): void {
    // this.dashboardWebsocketService.setStompSubscription(this.authService.isAuthenticated());
    if(this.authService.isAuthenticated()) {
      this.store.dispatch(new coreActions.SetOnLogin(this.authService.parsedToken));
    }
    this.subscribeForTfaEvent();
    this.subscribeForIdentityEvent();
    this.subscribeForKYCEvent();
    this.subscribeForLoginEvent();
    this.subscribeForMobileLoginEvent();
    this.subscribeForMobileRegistrationEvent();
    this.subscribeForRecoveryPasswordEvent();
    this.subscribeForRestoredPasswordPopup();
    this.subscribeForAlreadyRestoredPasswordPopup();
    this.subscribeForDemoTradingPopup();
    this.subscribeForSessionTimeSavedPopup();
    this.subscribeForChangedPasswordPopup();
    // this.setClientIp();
    this.subscribeForNotifications();
    this.subscribeForAlreadyRegisteredPopup();
    this.subscribeForInfoPopup();
  }

  subscribeForTfaEvent() {
    this.popupService.getTFAPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.isTfaPopupOpen = value ? true : false;
      });
  }

  subscribeForMobileLoginEvent() {
    this.popupService.getLoginMobilePopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.isLoginMobilePopupOpen = value;
      });
  }

  subscribeForDemoTradingPopup() {
    this.popupService.getDemoTradingPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.isOpenDemoTradingPopup = res;
      });
  }

  subscribeForAlreadyRegisteredPopup() {
    this.popupService.getAlreadyRegisteredPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.isOpenAlreadyRegisteredPopup = res;
      });
  }

  subscribeForInfoPopup() {
    this.popupService.getInfoPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.popupData = res;
        this.isOpenInfoPopup = !!res;
      });
  }

  subscribeForAlreadyRestoredPasswordPopup() {
    this.popupService.getAlreadyRestoredPasswordPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.isAlreadyRestoredPasswordPopupOpen = res;
      });
  }

  subscribeForRestoredPasswordPopup() {
    this.popupService.getRestoredPasswordPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.isRestoredPasswordPopupOpen = res;
      });
  }
  subscribeForSessionTimeSavedPopup() {
    this.popupService.getSessionTimeSavedPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.isSessionTimeSavedPopupOpen = res;
      });
  }

  subscribeForChangedPasswordPopup() {
    this.popupService.getChangedPasswordPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.isChangedPasswordPopupOpen = res;
      });
  }

  subscribeForMobileRegistrationEvent() {
    this.popupService.getRegistrationMobilePopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.isRegistrationMobilePopupOpen = value;
      });
  }

  subscribeForRecoveryPasswordEvent() {
    this.popupService.getRecoveryPasswordListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.isRecoveryPasswordPopupOpen = value;
      });
  }

  subscribeForLoginEvent() {
    this.popupService.getLoginPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.isLoginPopupOpen = value;
      });
  }

  subscribeForIdentityEvent() {
    this.popupService.getIdentityPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.isIdentityPopupOpen = value ? true : false;
      });
  }

  subscribeForKYCEvent() {
    this.popupService.getKYCPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.kycStep = value;
        this.isKYCPopupOpen = value ? true : false;
      });
  }

  isCurrentThemeDark(): boolean {
    return this.themeService.isCurrentThemeDark();
  }

  onNotificationMessageClose(index: number): void {
    this.notificationMessages.splice(index, 1);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.authService.removeSessionFinishListener();
  }

  private setIp() {

    this.http.get<IpAddress>(IP_CHECKER_URL)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        console.log(response)
        // this.logger.debug(this, 'Client IP: ' + response.ip);
        localStorage.setItem(IP_USER_KEY, response.ip);
      });
  }

  /**
   * Subscription for app notifications
   */
  private subscribeForNotifications(): void {
    this.notificationService.message
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((message: NotificationMessage) => {
        this.notificationMessages.push(message);
      });
  }
}
