import {Injectable, OnDestroy, NgZone} from '@angular/core';
import {environment} from '../../../environments/environment';
import {LoggingService} from './logging.service';
import * as jwt_decode from 'jwt-decode';
import {TOKEN} from './http.utils';
import {Subject, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import * as fromCore from '../../core/reducers';
import * as coreActions from '../../core/actions/core.actions';
import {PopupService} from './popup.service';
import {Router} from '@angular/router';
import {GtagService} from './gtag.service';
import {UtilsService} from './utils.service';

@Injectable()
export class AuthService implements OnDestroy {

  ENCODE_KEY = environment.encodeKey;
  apiUrl = environment.apiUrl;

  public simpleToken: { expiration: number, token_id: number, username: string, value: string };
  public ngUnsubscribe$ = new Subject<any>();
  public timeOutSub;
  public PROTECTED_ROUTES = ['/funds', '/orders', '/settings'];

  constructor(
    private logger: LoggingService,
    private http: HttpClient,
    private ngZone: NgZone,
    private router: Router,
    private popupService: PopupService,
    private store: Store<fromCore.State>,
    private gtagService: GtagService,
    private utilsService: UtilsService
  ) {
  }

  public parseToken(): ParsedToken {
    const token = this.token;
    if(token) {
      const parsedToken = jwt_decode(token);
      this.logger.debug(this, 'Simple token: ' + JSON.stringify(parsedToken));
      return parsedToken;
    }
    return null;
  }

  public isSessionValid() {
    const token = localStorage.getItem('token');
    if(token) {
      return this.http.get<any>(`${this.apiUrl}/api/private/v2/settings/isValid`)
    }
    return of(false);
  }

  public get token(): string {
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
    this.store.dispatch(new coreActions.SetOnLogoutAction());
    this.redirectOnLogout();
  }

  public redirectOnLogout() {
    const url = this.router.url;
    const isProtected = this.PROTECTED_ROUTES.some((r) => url.indexOf(r) >= 0);
    if(isProtected) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  public setSessionFinishListener(expiration: number): void {
    const tokenExpiresIn = expiration - Date.now();
    this.ngZone.runOutsideAngular(() => {
      this.timeOutSub = setTimeout(() => {
        this.onLogOut();
        this.popupService.toggleSessionExpiredPopup(true);
      }, +tokenExpiresIn)
    });
  }

  public removeSessionFinishListener(): void {
    if (this.timeOutSub) {
      clearInterval(this.timeOutSub);
    }
  }


  public checkTempToken(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/public/v2/users/validateTempToken/${token}`);
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
