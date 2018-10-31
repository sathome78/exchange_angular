import {Component, OnInit} from '@angular/core';
import {PopupService} from '../services/popup.service';
import {AuthService} from '../services/auth.service';
import {LoggingService} from '../services/logging.service';
import {Router} from '@angular/router';
import {ThemeService} from '../services/theme.service';
import {UserService} from '../services/user.service';
import {SettingsService} from '../settings/settings.service';
import {DashboardDataService} from '../dashboard/dashboard-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isMobileMenuOpen = false;

  constructor(private popupService: PopupService,
              private authService: AuthService,
              private logger: LoggingService,
              private router: Router,
              private themeService: ThemeService,
              private settingsService: SettingsService,
              private dashboardService: DashboardDataService,
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
    }
  }

  public openMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log('Open mobile menu');
  }

  public navigateToSettings() {
    this.isMobileMenuOpen = false;
    this.router.navigate(['/settings']);
  }


  onLogin() {
    this.logger.debug(this, 'Sign in attempt');
    this.popupService.showLoginPopup(true);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  onLogout() {
    this.logger.debug(this, 'User clicked log out');
    this.authService.onLogOut();
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

  setMobileWidget(widget: string) {
    this.dashboardService.activeMobileWidget.next(widget);
  }
}
