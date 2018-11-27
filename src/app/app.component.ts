import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopupService} from './services/popup.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ThemeService} from './services/theme.service';
import {IpAddress, UserService} from './services/user.service';
import {IP_CHECKER_URL, IP_USER_KEY} from './services/http.utils';
import {LoggingService} from './services/logging.service';
import {HttpClient} from '@angular/common/http';
import {NotificationsService} from './shared/components/notification/notifications.service';
import {NotificationMessage} from './shared/models/notification-message-model';
import {DashboardWebSocketService} from './dashboard/dashboard-websocket.service';
import {AuthService} from './services/auth.service';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'exrates-front-new';
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  tfaSubscription: Subscription;
  identitySubscription: Subscription;
  loginSubscription: Subscription;
  loginMobileSubscription: Subscription;
  // registrationMobileSubscription: Subscription;
  recoveryPasswordSubscription: Subscription;

  isTfaPopupOpen = false;
  isIdentityPopupOpen = false;
  isLoginPopupOpen = false;
  isLoginMobilePopupOpen = false;
  isRegistrationMobilePopupOpen = false;
  isRecoveryPasswordPopupOpen = false;
  /** notification messages array */
  notificationMessages: NotificationMessage[];

  constructor(private popupService: PopupService,
              private router: Router,
              private themeService: ThemeService,
              private dashboardWebsocketService: DashboardWebSocketService,
              private authService: AuthService,

              private userService: UserService,
              private logger: LoggingService,
              private http: HttpClient,
              private notificationService: NotificationsService) {
    // this.popupService.getShowTFAPopupListener().subscribe(isOpen => this.isTfaPopupOpen);
    this.setIp();
  }

  ngOnInit(): void {
    this.dashboardWebsocketService.setStompSubscription(this.authService.isAuthenticated());

    this.subscribeForTfaEvent();
    this.subscribeForIdentityEvent();
    this.subscribeForLoginEvent();
    this.subscribeForMobileLoginEvent();
    this.subscribeForMobileRegistrationEvent();
    this.subscribeForRecoveryPasswordEvent();
    // this.setClientIp();
    this.subscribeForNotifications();
  }

  subscribeForTfaEvent() {
    this.tfaSubscription = this.popupService
      .getTFAPopupListener()
      .subscribe(value => {
        this.isTfaPopupOpen = value ? true : false;
      });
  }

  subscribeForMobileLoginEvent() {
    this.loginMobileSubscription = this.popupService
      .getLoginMobilePopupListener()
      .subscribe(value => {
        this.isLoginMobilePopupOpen = value;
      });
  }

  subscribeForMobileRegistrationEvent() {
    this.popupService
      .getRegistrationMobilePopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        console.log('3');
        this.isRegistrationMobilePopupOpen = value;
        console.log(this.isRegistrationMobilePopupOpen);
      });
  }

  subscribeForRecoveryPasswordEvent() {
    this.popupService
      .getRecoveryPasswordListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.isRecoveryPasswordPopupOpen = value;
      });
  }

  subscribeForLoginEvent() {
    this.loginSubscription = this.popupService
      .getLoginPopupListener()
      .subscribe(value => {
        this.isLoginPopupOpen = value;
      });
  }

  subscribeForIdentityEvent() {
    this.identitySubscription = this.popupService
      .getIdentityPopupListener()
      .subscribe(value => {
        this.isIdentityPopupOpen = value ? true : false;
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
    this.tfaSubscription.unsubscribe();
    this.identitySubscription.unsubscribe();
    this.loginSubscription.unsubscribe();
    this.loginMobileSubscription.unsubscribe();
    // this.registrationMobileSubscription.unsubscribe();
  }

  private setIp() {
    this.http.get<IpAddress>(IP_CHECKER_URL)
      .subscribe( response => {
        // this.logger.debug(this, 'Client IP: ' + response.ip);
        localStorage.setItem(IP_USER_KEY, response.ip);
      });
  }

  /**
   * Subscription for app notifications
   */
  private subscribeForNotifications(): void {
    this.notificationService.message
      .subscribe((message: NotificationMessage) => {
        this.notificationMessages.push(message);
      });
  }
}
