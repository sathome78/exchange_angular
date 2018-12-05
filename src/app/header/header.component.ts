import {Component, OnInit} from '@angular/core';
import {PopupService} from '../shared/services/popup.service';
import {AuthService} from '../shared/services/auth.service';
import {LoggingService} from '../shared/services/logging.service';
import {Router} from '@angular/router';
import {ThemeService} from '../shared/services/theme.service';
import {UserService} from '../shared/services/user.service';
import {SettingsService} from '../settings/settings.service';
import {DashboardService} from '../dashboard/dashboard.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isMobileMenuOpen = false;
  public mobileView = 'markets';
  public userInfo;

  constructor(private popupService: PopupService,
              private authService: AuthService,
              private logger: LoggingService,
              private router: Router,
              private themeService: ThemeService,
              private settingsService: SettingsService,
              private dashboardService: DashboardService,
              private userService: UserService) {
  }

  ngOnInit() {
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
  }

  public openMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log('Open mobile menu');
  }

  public navigateToSettings() {
    this.isMobileMenuOpen = false;
    this.router.navigate(['/settings']);
  }

  public getUsername() {
    return this.authService.getUsername();
  }


  onLogin() {
    this.logger.debug(this, 'Sign in attempt');
    this.popupService.showLoginPopup(true);
  }

  onMobileLogin() {
    this.popupService.showMobileLoginPopup(true);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
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
    this.mobileView = widget;
    this.dashboardService.activeMobileWidget.next(widget);
  }
}
