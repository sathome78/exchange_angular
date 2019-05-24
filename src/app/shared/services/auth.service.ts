import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoggingService } from './logging.service';

import * as jwt_decode from 'jwt-decode';
import { TOKEN } from './http.utils';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as fromCore from '../../core/reducers';
import * as coreActions from '../../core/actions/core.actions';
import { PopupService } from './popup.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { GtagService } from './gtag.service';
import { UtilsService } from './utils.service';

@Injectable()
export class AuthService implements OnDestroy {

  ENCODE_KEY = environment.encodeKey;
  apiUrl = environment.apiUrl;

  public simpleToken: { expiration: number, token_id: number, username: string, value: string };
  public ngUnsubscribe$ = new Subject<any>();
  public timeOutSub;
  public parsedToken: ParsedToken = null;
  public PROTECTED_ROUTES = ['/funds', '/orders', '/settings'];

  constructor(
    private logger: LoggingService,
    private http: HttpClient,
    private ngZone: NgZone,
    private router: Router,
    private location: Location,
    private popupService: PopupService,
    private store: Store<fromCore.State>,
    private gtagService: GtagService,
    private utilsService: UtilsService,
  ) {
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  public parseToken(token: string): ParsedToken {
    this.parsedToken = jwt_decode(token);
    this.logger.debug(this, 'Simple token: ' + JSON.stringify(this.parsedToken));
    return this.parsedToken;
  }

  // private isTokenExpired(token: ParsedToken): boolean {
  //   if (token.expiration) {
  //     const tokenExpiresAt = new Date(token.expiration);
  //     this.logger.debug(this, 'Token expires at: ' + this.logger.formatDate(tokenExpiresAt));
  //     return tokenExpiresAt >= new Date();
  //   }
  //   return false;
  // }

  public get isVipUser() {
    if (this.token) {
      return this.parsedToken.userRole === 'VIP_USER';
    }
    return false;
  }

  private get token(): string {
    return localStorage.getItem(TOKEN);
  }

  public setToken(token: string) {
    if (token) {
      localStorage.setItem(TOKEN, token);
    }
  }

  public encodePassword(password: string) {
    return this.utilsService.encodePassword(password, this.ENCODE_KEY);
  }

  public onLogOut() {
    localStorage.removeItem(TOKEN);
    this.gtagService.removeUserId();
    this.parsedToken = null;
    this.store.dispatch(new coreActions.SetOnLogoutAction());
    this.redirectOnLogout();
  }

  public redirectOnLogout() {
    const url = this.router.url;
    const isProtected = this.PROTECTED_ROUTES.some((r) => url.indexOf(r) >= 0);
    if (isProtected) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  public setSessionFinishListener(expiration: number): void {
    const tokenExpiresIn = expiration - Date.now();
    this.ngZone.runOutsideAngular(() => {
      this.timeOutSub = setTimeout(() => {
        this.onLogOut();
        this.popupService.toggleSessionExpiredPopup(true);
      },                           +tokenExpiresIn);
    });
  }

  public removeSessionFinishListener(): void {
    if (this.timeOutSub) {
      clearInterval(this.timeOutSub);
    }
  }

  public getUsername(): string {
    if (this.parsedToken) {
      return this.parsedToken.username;
    }
    return undefined;
  }

  public getUserId(): string {
    if (this.parsedToken) {
      return this.parsedToken.publicId;
    }
    return undefined;
  }

  public checkTempToken(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/public/v2/users/validateTempToken/${token}`);
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
