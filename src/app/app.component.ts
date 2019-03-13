import {Component, OnDestroy, OnInit, enableProdMode} from '@angular/core';
import {PopupService} from './shared/services/popup.service';
import {ThemeService} from './shared/services/theme.service';
import {IpAddress, UserService} from './shared/services/user.service';
import {IP_CHECKER_URL, IP_USER_KEY} from './shared/services/http.utils';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './shared/services/auth.service';
import {Subject} from 'rxjs/Subject';
import {takeUntil, withLatestFrom} from 'rxjs/internal/operators';
import {TranslateService} from '@ngx-translate/core';
import {select, Store} from '@ngrx/store';
import * as fromCore from './core/reducers';
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

  constructor(
    public popupService: PopupService,
    private themeService: ThemeService,
    private userService: UserService,
    private authService: AuthService,
    private store: Store<fromCore.State>,
    private http: HttpClient,
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
          this.setNameEmailToZenChat(userInfo.username);
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
    if (this.authService.isAuthenticated()) {
      this.store.dispatch(new coreAction.SetOnLoginAction(this.authService.parsedToken));
    }
  }

  setDefaultCurrencyPair(currencies: SimpleCurrencyPair[]) {
    const pair = currencies.find((item) => (item.name === 'BTC/USD'));
    if(pair) {
      this.store.dispatch(new dashboardAction.ChangeActiveCurrencyPairAction(pair));
    }
  }
  setNameEmailToZenChat(userEmail: string): void {
    if(!userEmail) {
      return;
    }
    const name = userEmail.split('@')[0];
    const interval = setInterval(() => {
      console.log('interval');
      if(!(<any>window).$zopim) {
        return;
      }
      clearInterval(interval);
      (<any>window).$zopim(() => {
        (<any>window).$zopim.livechat.setOnConnected(() => {
          (<any>window).$zopim.livechat.setName(name);
          (<any>window).$zopim.livechat.setEmail(userEmail);
        })
      })
    }, 500);
  }

  isCurrentThemeDark(): boolean {
    return this.themeService.isCurrentThemeDark();
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
