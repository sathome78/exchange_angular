import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {PopupService} from '../shared/services/popup.service';
import {AuthService} from '../shared/services/auth.service';
import {LoggingService} from '../shared/services/logging.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ThemeService} from '../shared/services/theme.service';
import {UserService} from '../shared/services/user.service';
import {SettingsService} from '../settings/settings.service';
import {DashboardService} from '../dashboard/dashboard.service';
import {environment} from '../../environments/environment';
import {FUNDS_FLAG, REFERRAL_FLAG, ORDERS_FLAG, LANG_ARRAY, TRANSLATE_FLAG, IEO_FLAG, NGX_TRANSLATE_FLAG} from './header.constants';
import {MyBalanceItem} from '../model/my-balance-item.model';
import {Observable, Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {select, Store} from '@ngrx/store';
import {getLanguage, State} from '../core/reducers';
import {ChangeLanguageAction} from '../core/actions/core.actions';
import {takeUntil, withLatestFrom} from 'rxjs/operators';
import * as fromCore from '../core/reducers';
import * as coreActions from '../core/actions/core.actions';
import {BreakpointService} from 'app/shared/services/breakpoint.service';
import { IEOItem } from 'app/model/ieo.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public isMobileMenuOpen = false;
  public mobileView = 'markets';
  public userInfo$: Observable<ParsedToken>;
  // public ieoList$: Observable<IEOItem[]>;
  public showFundsList: boolean;
  public showOrdersList: boolean;
  public translateList: boolean;
  public ngxTranslateList: boolean;
  public showReferralList: boolean;
  public showIEOList: boolean;
  public isAuthenticated: boolean = false;
  public FUNDS_FLAG = FUNDS_FLAG;
  public NGX_TRANSLATE_FLAG = NGX_TRANSLATE_FLAG;
  public TRANSLATE_FLAG = TRANSLATE_FLAG;
  public REFERRAL_FLAG = REFERRAL_FLAG;
  public ORDERS_FLAG = ORDERS_FLAG;
  public IEO_FLAG = IEO_FLAG;
  public myBalance: Observable<MyBalanceItem>;
  public langArray = LANG_ARRAY;
  public lang;
  private ngUnsubscribe: Subject<void> = new Subject<void>();


  constructor(
    private popupService: PopupService,
    private authService: AuthService,
    private logger: LoggingService,
    private router: Router,
    private themeService: ThemeService,
    private settingsService: SettingsService,
    private dashboardService: DashboardService,
    private userService: UserService,
    private store: Store<State>,
    private cdr: ChangeDetectorRef,
    public breakpointService: BreakpointService,
    public translate: TranslateService
  ) {
    this.userInfo$ = this.store.pipe(select(fromCore.getUserInfo));
    // this.ieoList$ = this.store.pipe(select(fromCore.getIEOList));
  }

  ngOnInit() {
    this.resetDropdowns();
    if (this.authService.isAuthenticated()) {
      // this.userService.getUserColorScheme()
      //   .pipe(takeUntil(this.ngUnsubscribe))
      //   .subscribe(scheme => {
      //     if (scheme && scheme === 'DARK') {
      //       this.themeService.setDarkTheme();
      //     }
      //   });
    }
    this.dashboardService.activeMobileWidget
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.mobileView = res;
      });
    this.myBalance = this.dashboardService.getMyBalances();

    this.store.pipe(select(getLanguage))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.lang = this.langArray.filter(lang => lang.name === res)[0];
      });

    this.store
      .pipe(select(fromCore.getIsAuthenticated))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public openMenu() {
    if (!this.authService.isAuthenticated()) {
      this.popupService.showMobileLoginPopup(true);
    }
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // console.log('Open mobile menu');
  }

  public navigateToSettings() {
    this.isMobileMenuOpen = false;
    this.router.navigate(['/settings']);
  }

  public getUsername() {
    return this.authService.getUsername();
  }

  changeLocalization(lang: string) {
    this.lang = this.langArray.filter(item => item.name === lang.toLowerCase())[0];
    this.store.dispatch(new ChangeLanguageAction(lang));
    localStorage.setItem('language', lang);
}

  onLogin() {
    this.logger.debug(this, 'Sign in attempt');
    this.popupService.showLoginPopup(true);
  }

  onMobileLogin() {
    this.isMobileMenuOpen = false;
    this.popupService.showMobileLoginPopup(true);
  }

  isVisible(): boolean {
    return this.isAuthenticated && !environment.production;
  }

  onLogout() {
    this.logger.debug(this, 'User clicked log out');
    this.authService.onLogOut();
    this.userService.getUserBalance(null);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    if (this.authService.isAuthenticated()) {
      // console.log('Hi: ' + this.themeService.getColorScheme());
      this.settingsService.updateUserColorScheme(this.themeService.getColorScheme())
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
            // console.log(result);
          },
          err => {
            // console.error(err);
          });
    }
  }

  openRegistration() {
    this.popupService.showMobileRegistrationPopup(true);
  }

  setMobileWidget(widget: string) {
    this.isMobileMenuOpen = false;
    this.mobileView = widget;
    this.dashboardService.activeMobileWidget.next(widget);
  }

  resetDropdowns() {
    this.showFundsList = false;
    this.showOrdersList = false;
    this.showReferralList = false;
    this.ngxTranslateList = false;
    this.showIEOList = false;
  }


  toggleMenuDropdowns(showList: string) {
    switch (showList) {
      case FUNDS_FLAG:
        this.showFundsList = !this.showFundsList;
        break;
      case NGX_TRANSLATE_FLAG:
        this.ngxTranslateList = !this.ngxTranslateList;
        break;
      case ORDERS_FLAG:
        this.showOrdersList = !this.showOrdersList;
        break;
      case TRANSLATE_FLAG:
        this.translateList = !this.translateList;
        break;
      case REFERRAL_FLAG:
        this.showReferralList = !this.showReferralList;
        break;
      case IEO_FLAG:
        this.showIEOList = !this.showIEOList;
        break;
    }
  }

  mobileLinkClick(lang: string = null) {
    if (!!lang) this.changeLocalization(lang);
    this.resetDropdowns();
    this.mobileView = '';
    this.isMobileMenuOpen = false;
  }

  supportRedirect() {
    const encodeData = btoa(JSON.stringify({
      login: this.authService.isAuthenticated()
    }));
    window.open(`https://news.exrates.me?data=${encodeData}`);
  }

  // temp solution
  // tempPopup() {
  //   if (environment.production) {
  //     this.popupService.demoPopupMessage = 1;
  //     this.popupService.showDemoTradingPopup(true);
  //   }
  // }

  get showContent() {
    return environment.showContent;
  }
}
