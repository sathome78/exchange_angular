import {Component, OnInit} from '@angular/core';
import {PopupService} from '../shared/services/popup.service';
import {AuthService} from '../shared/services/auth.service';
import {LoggingService} from '../shared/services/logging.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ThemeService} from '../shared/services/theme.service';
import {UserService} from '../shared/services/user.service';
import {SettingsService} from '../settings/settings.service';
import {DashboardService} from '../dashboard/dashboard.service';
import {environment} from '../../environments/environment';
import {FUNDS_FLAG, REFERRAL_FLAG, ORDERS_FLAG, LANG_ARRAY} from './header.constants';
import {MyBalanceItem} from '../core/models/my-balance-item.model';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {select, Store} from '@ngrx/store';
import {getLanguage, State} from '../core/reducers';
import {ChangeLanguageAction} from '../core/actions/core.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isMobileMenuOpen = false;
  public mobileView = 'markets';
  public userInfo;
  public showFundsList: boolean;
  public showOrdersList: boolean;
  public showReferralList: boolean;
  public FUNDS_FLAG = FUNDS_FLAG;
  public REFERRAL_FLAG = REFERRAL_FLAG;
  public ORDERS_FLAG = ORDERS_FLAG;
  public myBalance: Observable<MyBalanceItem>;
  public langArray = LANG_ARRAY;
  public lang;


  constructor(private popupService: PopupService,
              private authService: AuthService,
              private logger: LoggingService,
              private router: Router,
              private themeService: ThemeService,
              private settingsService: SettingsService,
              private dashboardService: DashboardService,
              private userService: UserService,
              private store: Store<State>,
              public translate: TranslateService) {}

  ngOnInit() {
    this.resetDropdowns();
    if (this.authService.isAuthenticated()) {
      this.userService.getUserColorScheme()
        .subscribe(scheme => {
          if (scheme && scheme === 'DARK') {
            this.themeService.setDarkTheme();
          }
        });
      this.userInfo = this.authService.simpleToken;
    }
    this.authService.onLoginLogoutListener$.subscribe(res => {
      if (res.username !== '') {
        this.userInfo.username = res.username;
      } else {
        this.userInfo = null;
      }
    });
    this.dashboardService.activeMobileWidget.subscribe(res => {
      this.mobileView = res;
    });
    this.myBalance = this.dashboardService.getMyBalances();

    this.store.pipe(select(getLanguage)).subscribe(res => {
      this.lang = this.langArray.filter(lang => lang.name === res)[0];
    });
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
}

  onLogin() {
    this.logger.debug(this, 'Sign in attempt');
    this.popupService.showLoginPopup(true);
  }

  onMobileLogin() {
    this.isMobileMenuOpen = false;
    this.popupService.showMobileLoginPopup(true);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isVisible(): boolean {
    return this.isAuthenticated() && !environment.production;
  }

  onLogout() {
    this.logger.debug(this, 'User clicked log out');
    this.authService.onLogOut();
    this.userService.getUserBalance(null);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    if (this.authService.isAuthenticated()) {
      console.log('Hi: ' + this.themeService.getColorScheme());
      this.settingsService.updateUserColorScheme(this.themeService.getColorScheme())
        .subscribe(result => {
            console.log(result);
          },
          err => {
            console.log(err);
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
  }


  toggleMenuDropdowns(showList: string) {
    switch (showList) {
      case FUNDS_FLAG:
        this.showFundsList = !this.showFundsList;
        break;
      case ORDERS_FLAG:
        this.showOrdersList = !this.showOrdersList;
        break;
      case REFERRAL_FLAG:
        this.showReferralList = !this.showReferralList;
        break;
    }
  }

  mobileLinkClick() {
    this.resetDropdowns();
    this.mobileView = '';
    this.isMobileMenuOpen = false;
  }

// temp solution
  tempPopup() {
    if (environment.production) {
      this.popupService.demoPopupMessage = 1;
      this.popupService.showDemoTradingPopup(true);
    }
  }
}
