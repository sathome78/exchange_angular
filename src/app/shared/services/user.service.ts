import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { map, catchError } from 'rxjs/internal/operators';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { LangService } from './lang.service';
import { AuthCandidate } from '../../model/auth-candidate.model';
import { LoggingService } from './logging.service';
import { TokenHolder } from '../../model/token-holder.model';
import { RefreshUserBalanceAction } from '../../dashboard/actions/dashboard.actions';
import { defaultUserBalance } from '../../dashboard/reducers/default-values';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import * as fromCore from '../../core/reducers';
import { APIErrorsService } from './apiErrors.service';
import { UtilsService } from './utils.service';

@Injectable()
export class UserService {
  HOST = environment.apiUrl;
  public isAuthenticated = false;

  constructor(
    private store: Store<fromCore.State>,
    private http: HttpClient,
    private authService: AuthService,
    private langService: LangService,
    private stompService: RxStompService,
    private utilsService: UtilsService,
    private logger: LoggingService,
    private apiErrorsService: APIErrorsService,
    private router: Router
  ) {
    this.store.pipe(select(fromCore.getIsAuthenticated)).subscribe((isAuth: boolean) => {
      this.isAuthenticated = isAuth;
    });
  }

  checkIfEmailExists(email: string): Observable<any> {
    const encodedEmail = encodeURIComponent(email);
    const httpOptions: any = {
      params: new HttpParams().set('email', encodedEmail),
    };
    return this.http.get<any>(`${this.HOST}/api/public/v2/if_email_exists`, httpOptions);
  }

  emailValidator(recovery?: boolean): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.checkIfEmailExists(control.value.trim())
        .pipe(map((isExist: boolean) => (recovery ? !isExist : isExist)))
        .pipe(map((isExist: boolean) => (isExist ? { emailExists: true } : null)))
        .pipe(catchError(err => of(this.checkError(err, recovery))));
    };
  }

  checkError(error, recovery: boolean) {
    if (error['status'] === 400) {
      switch (error.error.title) {
        case 'USER_REGISTRATION_NOT_COMPLETED':
          return { USER_REGISTRATION_NOT_COMPLETED: true };
        case 'USER_NOT_ACTIVE':
          return { USER_NOT_ACTIVE: true };
        case 'USER_EMAIL_NOT_FOUND':
          return !recovery ? null : { USER_EMAIL_NOT_FOUND: true };
      }
    } else {
      return { checkEmailCrash: true };
    }
  }

  checkIfUsernameExists(username: string): Observable<any> {
    const httpOptions = {
      params: new HttpParams().set('username', username),
    };
    return this.http.get<string[]>(this.getUrl('if_username_exists'), httpOptions);
  }

  public getUserBalance(pair: SimpleCurrencyPair) {
    if (this.isAuthenticated && pair.id) {
      const sub = this.http.get(`${this.HOST}/api/private/v2/dashboard/info/${pair.id}`).subscribe(
        info => {
          this.store.dispatch(new RefreshUserBalanceAction(info));
          sub.unsubscribe();
        },
        err => {
          console.error(err);
          sub.unsubscribe();
        }
      );
    } else {
      this.store.dispatch(new RefreshUserBalanceAction(defaultUserBalance));
    }
  }

  public getUserBalanceCurr(currencies: string[]): Observable<any> {
    return this.http.get(`${this.HOST}/api/private/v2/balances/myBalances`, {
      params: { names: currencies },
    });
  }

  public getIfConnectionSuccessful(): Observable<boolean> {
    return this.http.get<boolean>(this.getUrl('test'));
  }

  public createNewUser(
    username: string,
    email: string,
    password: string,
    language: string,
    sponsor?: string
  ): Promise<number> {
    const registrate = {
      email,
      nickname: username,
      password: this.authService.encodePassword(password),
      language: this.langService.getLanguage(),
      sponsor: sponsor ? sponsor : '',
    };
    return this.http
      .post<number>(this.getUrl('register'), JSON.stringify(registrate))
      .toPromise()
      .then(this.extractId)
      .catch(this.handleErrorPromise);
  }

  public authenticateUser(email: string, password: string, pin?: string, tries?: number): Observable<{} | TokenHolder> {
    const encryptedPassword = this.utilsService.encodePassword(password, environment.encodeKey);
    const authCandidate = AuthCandidate.builder()
      .withEmail(email)
      .withPassword(encryptedPassword)
      .withPinCode(pin)
      .withPinTries(tries)
      .build();
    // alert('encoded: ' +  authCandidate.password);

    this.logger.debug(this, `User password ${password} is encrypted to ${authCandidate.password}`);
    // const mHeaders = MEDIA_TYPE_JSON.append(IP_USER_HEADER, localStorage.getItem('client_ip'));
    const mParams = new HttpParams();

    if (pin) {
      mParams.set('checkPin', pin);
    }
    const headers = new HttpHeaders();

    headers.set('GACookies', document.cookie);

    const httpOptions = {
      headers,
      params: mParams,
      withCredentials: true,
    };

    // console.log(JSON.stringify(authCandidate));
    return this.http
      .post<TokenHolder>(this.getUrl('users/authenticate'), JSON.stringify(authCandidate), {
        ...httpOptions,
        observe: 'response',
      })
      .pipe(this.apiErrorsService.catchAPIErrorWithNotification(true));
  }

  sendToEmailConfirmation(email: string, isUsa: boolean, inviteCode: string) {
    const data = { email, isUsa, inviteCode };
    return this.http
      .post<TokenHolder>(this.getUrl('users/register'), data, { observe: 'response' })
      .pipe(this.apiErrorsService.catchAPIErrorWithNotification(true));
  }

  sendToEmailForRecovery(email: string) {
    const data = { email, isUsa: false };
    return this.http
      .post<TokenHolder>(this.getUrl('users/password/recovery/reset'), data, { observe: 'response' })
      .pipe(this.apiErrorsService.catchAPIErrorWithNotification(true));
  }

  public getUserColorScheme(): Observable<string> {
    const url = this.HOST + '/api/private/v2/settings/color-schema';
    return this.http.get<string>(url);
  }
  public getUserColorEnabled(): Observable<boolean> {
    const url = this.HOST + '/api/private/v2/settings/isLowColorEnabled';
    return this.http.get<boolean>(url);
  }

  public finalRegistration(data): Observable<any> {
    const url = `${this.HOST}/api/public/v2/users/password/create`;
    return this.http.post(url, data);
  }

  public recoveryPassword(data): Observable<any> {
    const url = `${this.HOST}/api/public/v2/users/password/recovery/create`;
    return this.http
      .post(url, data, { observe: 'response' })
      .pipe(this.apiErrorsService.catchAPIErrorWithNotification(true));
  }

  public getCheckTo2FAEnabled(email: string): Observable<boolean> {
    const encodedEmail = encodeURIComponent(email);
    return this.http.get<boolean>(
      `${this.HOST}/api/public/v2/is_google_2fa_enabled?email=${encodedEmail}`
    );
  }

  public sendTestNotif(msg: string): Observable<any> {
    const httpOptions = {
      params: new HttpParams().set('message', 'Test notification'),
    };
    return this.http.get<boolean>(
      `${this.HOST}/api/private/v2/settings/jksdhfbsjfgsjdfgasj/personal/success`,
      httpOptions
    );
  }

  extractId(body: number) {
    return body;
  }

  handleErrorPromise(error: Response | any) {
    console.error(error.message || error);
    return Promise.reject(error.message || error);
  }

  getUrl(end: string) {
    return `${this.HOST}/api/public/v2/${end}`;
  }

  public getTransactionsCounterForGTag(): Observable<any> {
    const url = this.HOST + '/api/private/v2/balances/refill/afgssr/gtag';
    return this.http.get<any>(url);
  }
  public clearTransactionsCounterForGTag(): Observable<any> {
    const url = this.HOST + '/api/private/v2/balances/refill/afgssr/gtag';
    return this.http.delete<any>(url);
  }

  public getNotifications(publicId: string): Observable<any> {
    return this.stompService
      .watch(`/app/message/private/${publicId}`, {
        'Exrates-Rest-Token': this.authService.token || '',
      })
      .pipe(map((message: Message) => JSON.parse(message.body)));
  }

  public unsubscribeMail(token, id, subscribe): Observable<boolean> {
    let url = '';
    if (token) {
      url = `${this.HOST}/api/public/v2/mailing-subscription?token=${token}&subscribe=${subscribe}`;
    }
    if (id) {
      url = `${this.HOST}/api/public/v2/mailing-subscription?public_id=${id}&subscribe=${subscribe}`;
    }
    return this.http.post<any>(url, null);
  }
}

export interface IpAddress {
  ip: string;
}
