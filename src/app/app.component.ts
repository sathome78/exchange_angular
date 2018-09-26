import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopupService} from './services/popup.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ThemeService} from './services/theme.service';
import {UserService} from './services/user.service';
import {IP_USER_KEY} from './services/http.utils';
import {LoggingService} from './services/logging.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'exrates-front-new';

  isTfaPopupOpen = false;
  tfaSubscription: Subscription;
  identitySubscription: Subscription;
  loginSubscription: Subscription;
  isIdentityPopupOpen = false;
  isLoginPopupOpen = false;

  constructor(private popupService: PopupService,
              private router: Router,
              private themeService: ThemeService,
              private userService: UserService,
              private logger: LoggingService,
              private http: HttpClient) {
    // this.popupService.getShowTFAPopupListener().subscribe(isOpen => this.isTfaPopupOpen);
  }

  ngOnInit(): void {
    this.subscribeForTfaEvent();
    this.subscribeForIdentityEvent();
    this.subscribeForLoginEvent();
    // this.setClientIp();
  }

  subscribeForTfaEvent() {
    this.tfaSubscription = this.popupService
      .getTFAPopupListener()
      .subscribe(value => {
        this.isTfaPopupOpen = value ? true : false;
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

  ngOnDestroy(): void {
    this.tfaSubscription.unsubscribe();
    this.identitySubscription.unsubscribe();
    this.loginSubscription.unsubscribe();
  }
}
