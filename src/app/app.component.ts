import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopupService} from './shared/services/popup.service';
import {ThemeService} from './shared/services/theme.service';
import {IpAddress, UserService} from './shared/services/user.service';
import {IP_CHECKER_URL, USER_IP} from './shared/services/http.utils';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './shared/services/auth.service';
import {Subject} from 'rxjs/Subject';
import {takeUntil, withLatestFrom, take} from 'rxjs/internal/operators';
import {TranslateService} from '@ngx-translate/core';
import {select, Store} from '@ngrx/store';
import * as fromCore from './core/reducers';
import * as coreAction from './core/actions/core.actions';
import * as dashboardAction from './dashboard/actions/dashboard.actions';
import {SimpleCurrencyPair} from './model/simple-currency-pair';
import {SEOService} from './shared/services/seo.service';
import {UtilsService} from './shared/services/utils.service';
import {IEOServiceService} from './shared/services/ieoservice.service';
import { IEOItem } from './model/ieo.model';
import {ChangeLanguageAction} from './core/actions/core.actions';
import {getLanguage} from './core/reducers';
import {GtagService} from './shared/services/gtag.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'exrates-front-new';
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public isAuthenticated: boolean = false;
  public shouldSetDefaultCurrPair: boolean = true;
  public technicalWorks = true;

  constructor(
    public popupService: PopupService,
    private themeService: ThemeService,
    private userService: UserService,
    private utilsService: UtilsService,
    private authService: AuthService,
    private ieoService: IEOServiceService,
    private seoService: SEOService,
    private store: Store<fromCore.State>,
    private http: HttpClient,
    public translate: TranslateService,
    private gtagService: GtagService
  ) {
    // this.popupService.getShowTFAPopupListener().subscribe(isOpen => this.isTfaPopupOpen);


    // translate.addLangs(['en', 'ru', 'uk', 'pl']);
    // translate.setDefaultLang('en');
    // const browserLang = translate.getBrowserLang();
    // this.store.dispatch(new ChangeLanguageAction(browserLang.match(/en|ru|uk|pl/) ? browserLang : 'en'));

    // uncomment when the translation is ready
    // this.store
    //   .pipe(select(getLanguage))
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe(res => this.translate.use(res));

    this.setIp();

    this.store
      .pipe(select(fromCore.getIsAuthenticated))
      .pipe(withLatestFrom(this.store.pipe(select(fromCore.getUserInfo))))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([isAuth, userInfo]: [boolean, ParsedToken]) => {
        this.isAuthenticated = isAuth;
        if(isAuth && userInfo) {
          this.store.dispatch(new coreAction.LoadVerificationStatusAction());
          // this.authService.setSessionFinishListener(userInfo.expiration);
          this.sendTransactionsAnalytics();
          this.setNameEmailToZenChat(userInfo.username);
        } else {
          // this.authService.removeSessionFinishListener();
          this.clearNameEmailFromZenChat();
        }
      });

    this.setSavedCurrencyPair();

    this.store
      .pipe(select(fromCore.getSimpleCurrencyPairsSelector))
      .pipe(take(2))
      .subscribe((currencies: SimpleCurrencyPair[]) => {
        if(this.shouldSetDefaultCurrPair) {
          this.setDefaultCurrencyPair(currencies);
        }
      });
  }

  ngOnInit(): void {
    // if (this.authService.isAuthenticated() && !!this.authService.getUserId()) {
    //   this.gtagService.setUserId(this.authService.getUserId());
    // } else {
      const token = localStorage.getItem('token')
      if(token) {
        const parsedToken = this.authService.parseToken(token);
        this.gtagService.setUserId(parsedToken.publicId);
        this.store.dispatch(new coreAction.SetOnLoginAction(parsedToken));
      }
    // }
    this.gtagService.initGtag();


    this.seoService.subscribeToRouter(); // SEO optimization
    this.store.dispatch(new coreAction.LoadCurrencyPairsAction());
    if (this.authService.isAuthenticated()) {
      this.store.dispatch(new coreAction.SetOnLoginAction(this.authService.parsedToken));
    }

    this.ieoService.getListIEO()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: IEOItem[]) => {
        this.store.dispatch(new coreAction.SetIEOListAction(res))
      })
  }

  setSavedCurrencyPair() {
    const savedPair = this.utilsService.getActiveCurrencyPairFromSS();
    if (savedPair) {
      const pair = JSON.parse(savedPair);
      this.store.dispatch(new dashboardAction.ChangeActiveCurrencyPairAction(pair));
      this.utilsService.saveActiveCurrencyPairToSS(pair);
      this.userService.getUserBalance(pair);
      this.shouldSetDefaultCurrPair = false;
    }
  }

  setDefaultCurrencyPair(currencies: SimpleCurrencyPair[]) {
    const pair = currencies.find((item) => (item.name === 'BTC/USD'));
    if(pair) {
      this.store.dispatch(new dashboardAction.ChangeActiveCurrencyPairAction(pair));
      this.utilsService.saveActiveCurrencyPairToSS(pair);
      this.userService.getUserBalance(pair);
    }
  }
  setNameEmailToZenChat(userEmail: string): void {
    if(!userEmail) {
      return;
    }
    const name = userEmail.split('@')[0];
    const interval = setInterval(() => {
      if(!(<any>window).$zopim) {
        return;
      }
      clearInterval(interval); // waiting for initializing chat widget
      (<any>window).$zopim(() => {
        (<any>window).$zopim.livechat.setName(name);
        (<any>window).$zopim.livechat.setEmail(userEmail);
      })
    }, 500);
  }
  clearNameEmailFromZenChat(): void {
    if(!(<any>window).$zopim) {
      return;
    }
    (<any>window).$zopim(() => {
      (<any>window).$zopim.livechat.clearAll();
    })
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

    // this.http.get<IpAddress>(IP_CHECKER_URL)
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe(response => {
    //     console.log(response);
    //     // this.logger.debug(this, 'Client IP: ' + response.ip);
    //     localStorage.setItem(USER_IP, response.ip);
    //   });
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
              this.gtagService.sendTransactionSuccessGtag();
            }
            this.userService.clearTransactionsCounterForGTag()
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(() => {});
          }
        });
    }, 3000);
  }
}
