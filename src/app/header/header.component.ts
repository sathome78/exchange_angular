import { Component, OnInit } from '@angular/core';
import {PopupService} from '../services/popup.service';
import {AuthService} from '../services/auth.service';
import {LoggingService} from '../services/logging.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isMobileMenuOpen = false;

  constructor(private popupService: PopupService,
              private authService: AuthService,
              private logger: LoggingService) { }

  ngOnInit() {
  }

  public openMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log('Open mobile menu');
  }


  onLogin() {
    this.logger.debug(this, 'Sign in attempt');
    // todo remove after applied
    this.authService.onLogIn();
    this.popupService.showLoginPopup(true);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  onLogout() {
    this.logger.debug(this, 'User clicked log out');
    this.authService.onLogOut();
  }
}
