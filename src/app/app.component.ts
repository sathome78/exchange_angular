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
import * as coreAction from './core/actions/core.actions';
import * as dashboardAction from './dashboard/actions/dashboard.actions';
import { SimpleCurrencyPair } from './model/simple-currency-pair';


declare var sendTransactionSuccessGtag: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'exrates-front-new';
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public isAuthenticated: boolean = false;
  public kycStep = 1;
  public popupData: PopupData;
  public kycIframeUrl = '';

  isTfaPopupOpen = false;
  isIdentityPopupOpen = false;
  isKYCPopupOpen = false;
  isOpenDemoTradingPopup = false;
  isOpenInfoPopup = false;
  /** notification messages array */
  notificationMessages: NotificationMessage[];

  constructor(
    public popupService: PopupService,
    private themeService: ThemeService,
    private userService: UserService,
    private authService: AuthService,
    private store: Store<fromCore.State>,
    private http: HttpClient,
    private notificationService: NotificationsService,
    public translate: TranslateService
  ) {
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
        this.isAuthenticated = isAuth;
        if(isAuth && userInfo) {
          this.authService.setSessionFinishListener(userInfo.expiration);
          this.sendTransactionsAnalytics();
        } else {
          this.authService.removeSessionFinishListener();
        }
      });

    this.store
      .pipe(select(fromCore.getSimpleCurrencyPairsSelector))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((currencies: SimpleCurrencyPair[]) => {
        this.setDefaultCurrencyPair(currencies);
      });
  }

  ngOnInit(): void {
    this.store.dispatch(new coreAction.LoadCurrencyPairsAction());
    // this.store.dispatch(new coreAction.LoadFiatCurrenciesForChoose());
    // this.dashboardWebsocketService.setStompSubscription(this.authService.isAuthenticated());
    if(this.authService.isAuthenticated()) {
      this.store.dispatch(new coreAction.SetOnLoginAction(this.authService.parsedToken));
    }
    this.subscribeForTfaEvent();
    this.subscribeForIdentityEvent();
    this.subscribeForKYCEvent();
    // this.subscribeForDemoTradingPopup();
    this.subscribeForNotifications();
    // this.subscribeForInfoPopup();
  }

  setDefaultCurrencyPair(currencies: SimpleCurrencyPair[]) {
    const pair = currencies.find((item) => (item.name === 'BTC/USD'));
    if(pair) {
      this.store.dispatch(new dashboardAction.ChangeActiveCurrencyPairAction(pair));
    }
  }

  subscribeForTfaEvent() {
    this.popupService.getTFAPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.isTfaPopupOpen = value ? true : false;
      });
  }


  // subscribeForDemoTradingPopup() {
  //   this.popupService.getDemoTradingPopupListener()
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe(res => {
  //       this.isOpenDemoTradingPopup = res;
  //     });
  // }


  // subscribeForInfoPopup() {
  //   this.popupService.getInfoPopupListener()
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe(res => {
  //       this.popupData = res;
  //       this.isOpenInfoPopup = !!res;
  //     });
  // }


  subscribeForIdentityEvent() {
    this.popupService.getIdentityPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.isIdentityPopupOpen = !!value;
      });
  }

  subscribeForKYCEvent() {
    this.popupService.getKYCPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.kycStep = value.step;
        this.kycIframeUrl = value.url;
        this.isKYCPopupOpen = !!value.step;
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
        // console.log(response);
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

  private sendTransactionsAnalytics() {
    setTimeout(() => {
      if(!this.isAuthenticated) {
        return;
      }
      this.userService.getTransactionsCounterForGTag()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((res) => {
          if(res.count > 0) {
            for(let i = 0; i < res.count; i++) {
              sendTransactionSuccessGtag();
            }
            this.userService.clearTransactionsCounterForGTag()
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(() => {});
          }
        });
    }, 3000);
  }
}
