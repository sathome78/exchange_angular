import {Injectable, OnDestroy, NgZone} from '@angular/core';
import {environment} from '../../../environments/environment';
import {TokenHolder} from '../../model/token-holder.model';
import {LoggingService} from './logging.service';

import * as jwt_decode from 'jwt-decode';
import {TOKEN} from './http.utils';
import {Subject, Observable, BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {takeUntil} from 'rxjs/operators';

declare var encodePassword: Function;

@Injectable()
export class AuthService implements OnDestroy {

  ENCODE_KEY = environment.encodeKey;
  apiUrl = environment.apiUrl;

  private tokenHolder: TokenHolder;
  public simpleToken: { expiration: number, token_id: number, username: string, value: string };
  public ngUnsubscribe$ = new Subject<any>();
  public onLoginLogoutListener$ = new Subject<{ expiration: number, token_id: number, username: string, value: string }>();
  public onSessionFinish$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public timeOutSub;

  constructor(
    private logger: LoggingService,
    private http: HttpClient,
    private ngZone: NgZone,
  ) {

    this.onSessionFinish$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        if (!res) {
          return;
        }

        this.onLogOut();
      });
  }


  public isAuthenticated(): boolean {
    if (this.token) {
      this.logger.debug(this, 'Token from local storage: ' + this.token.substring(0, 6));
      this.parseToken(this.token);
      return this.isTokenExpired();
    }
    return false;
  }

  onLogOut() {
    this.simpleToken = {expiration: 0, username: '', token_id: 0, value: ''};
    this.onLoginLogoutListener$.next(this.simpleToken);
    localStorage.removeItem(TOKEN);
    location.reload();
  }

  encodePassword(password: string) {
    return encodePassword(password, this.ENCODE_KEY);
  }

  public setTokenHolder(tokenHolder: TokenHolder) {
    this.tokenHolder = tokenHolder;
    if (tokenHolder.token) {
      localStorage.setItem(TOKEN, tokenHolder.token);
    }
  }

  private parseToken(token: string): void {
    this.simpleToken = jwt_decode(token);
    this.logger.debug(this, 'Simple token: ' + JSON.stringify(this.simpleToken));
  }

  private isTokenExpired() {
    if (this.simpleToken.expiration) {
      const tokenExpiresAt = new Date(this.simpleToken.expiration);
      this.logger.debug(this, 'Token expires at: ' + this.logger.formatDate(tokenExpiresAt));
      return tokenExpiresAt >= new Date();
    }
    return false;
  }

  private get token(): string {
    return localStorage.getItem(TOKEN);
  }

  public setSessionFinishListener(): void {
    if (!this.isAuthenticated()) {
      return;
    }
    this.parseToken(this.token);
    const tokenExpiresIn = +this.simpleToken.expiration - Date.now();
    this.ngZone.runOutsideAngular(() => {
      this.timeOutSub = setTimeout(() => {
        this.onSessionFinish$.next(true);
      }, +tokenExpiresIn);
    });
  }

  public removeSessionFinishListener(): void {
    if (this.timeOutSub) {
      clearInterval(this.timeOutSub);
    }
  }

  public getUsername(): string {
    if (this.simpleToken) {
      return this.simpleToken.username;
    }
    return undefined;
  }

  public onLogIn() {
    this.setSessionFinishListener();
  }

  public checkTempToken(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/public/v2/users/validateTempToken/${token}`);
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
