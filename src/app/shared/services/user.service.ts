import {Router} from '@angular/router';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AsyncValidatorFn, AbstractControl} from '@angular/forms';
import {tap, map, catchError} from 'rxjs/internal/operators';
import {Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';

import {environment} from '../../../environments/environment';
import {AuthService} from './auth.service';
import {IP_USER_HEADER, IP_USER_KEY} from './http.utils';
import {LangService} from './lang.service';
import {AuthCandidate} from '../../model/auth-candidate.model';
import {LoggingService} from './logging.service';
import {TokenHolder} from '../../model/token-holder.model';
import {CurrencyPair} from '../../model/currency-pair.model';
import {State} from '../../dashboard/reducers/dashboard.reducer';
import {RefreshUserBalanceAction} from '../../dashboard/actions/dashboard.actions';
import {defaultUserBalance} from '../../dashboard/reducers/default-values';


@Injectable()
export class UserService {

  HOST = environment.apiUrl;


  constructor(
    private store: Store<State>,
    private http: HttpClient,
    private authService: AuthService,
    private langService: LangService,
    private logger: LoggingService,
    private router: Router) {
  }

   checkIfEmailExists(email: string): Observable<boolean> {
    const httpOptions = {
      params:  new HttpParams().set('email', email)
    };
    return this.http.get<boolean>(this.getUrl('if_email_exists'), httpOptions);
  }

  emailValidator(recovery?: boolean): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.checkIfEmailExists(control.value.trim())
        .pipe(map((isExist: boolean) => recovery ? !isExist : isExist))
        .pipe(map((isExist: boolean) => isExist ? {'emailExists': true} : null))
        .pipe(catchError(() => of({'checkEmailCrash': true})));
    };
  }

  checkIfUsernameExists(username: string): Observable<any> {
    const httpOptions = {
      params:  new HttpParams().set('username', username)
    };
    return this.http.get<string[]>(this.getUrl('if_username_exists'), httpOptions);
  }

  public getUserBalance(pair: CurrencyPair) {
    if (this.authService.isAuthenticated() && pair.currencyPairId) {
      const sub = this.http.get(`${this.HOST}/info/private/v2/dashboard/info/${pair.currencyPairId}`)
        .subscribe(info => {
          this.store.dispatch(new RefreshUserBalanceAction(info));
          sub.unsubscribe();
        });
    } else {
      this.store.dispatch(new RefreshUserBalanceAction(defaultUserBalance));
    }
  }

  public getIfConnectionSuccessful(): Observable<boolean> {
    return this.http.get<boolean>(this.getUrl('test'));
  }

  public createNewUser(username: string, email: string,
                password: string, language: string,
                sponsor?: string): Promise<number> {

    const registrate = {
      'nickname': username,
      'email': email,
      'password': this.authService.encodePassword(password),
      'language': this.langService.getLanguage(),
      'sponsor': (sponsor) ? sponsor : ''
    };
    return this.http.post<number>(this.getUrl('register'), JSON.stringify(registrate))
      .toPromise()
      .then(this.extractId)
      .catch(this.handleErrorPromise);
  }

  public authenticateUser(email: string, password: string, pin?: string, tries?: number): Observable<{} | TokenHolder> {
    const authCandidate = AuthCandidate
      .builder()
      .withEmail(email)
      .withPassword(password)
      .withPinCode(pin)
      .withClientIp()
      .build();
    // alert('encoded: ' +  authCandidate.password);

    this.logger.debug(this, 'User password ' + password + ' is encrypted to ' + authCandidate.password);
    // const mHeaders = MEDIA_TYPE_JSON.append(IP_USER_HEADER, localStorage.getItem('client_ip'));
    const mParams = new HttpParams();

    if (pin) {
      mParams.set('checkPin', pin);
    }
    const headers = new HttpHeaders();

    headers.set('GACookies', document.cookie);

    const httpOptions = {
      params: mParams,
      withCredentials: true,
      headers
    };

    authCandidate.tries = tries;

    console.log(JSON.stringify(authCandidate));
    return this.http.post<TokenHolder>(this.getUrl('users/authenticate'), JSON.stringify(authCandidate), httpOptions);
  }

  sendToEmailConfirmation(email: string) {
    const data = {'email': email};
    return this.http.post<TokenHolder>(this.getUrl('users/register'), data);
  }

  sendToEmailForRecovery(email: string) {
    const data = {'email': email};
    return this.http.post<TokenHolder>(this.getUrl('users/recoveryPassword'), data);
  }

  public getUserColorScheme(): Observable<string> {
    const url = this.HOST + '/info/private/v2/settings/color-schema';
    return this.http.get<string>(url);
  }
  public getUserColorEnabled(): Observable<boolean> {
    const url = this.HOST + '/info/private/v2/settings/isLowColorEnabled';
    return this.http.get<boolean>(url);
  }

  public finalRegistration(data): Observable<any> {
    const url = `${this.HOST}/info/public/v2/users/createPassword`;
    return this.http.post(url, data);
  }

  public recoveryPassword(data): Observable<any> {
    const url = `${this.HOST}/info/public/v2/users/createRecoveryPassword`;
    return this.http.post(url, data);
  }

  public getUserGoogleLoginEnabled(email: string): Observable<boolean> {
    const httpOptions = {
      params:  new HttpParams().set('email', email)
    };
    return this.http.get<boolean>(this.getUrl('is_google_2fa_enabled'), httpOptions);
  }

  // public getUserIp(): Observable<IpAddress> {
  //   return this.http.get<IpAddress>('http://gd.geobytes.com/GetCityDetails');
  // }

  // restorePassword(email: string, password: string): Observable<any> {
  //     const encodedPassword = this.authService.encodePassword(password);
  //   const url = this.HOST + '/rest/user/restorePassword';
  //   const mHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  //
  //   const httpOptions = {
  //     headers: mHeaders
  //   };
  //
  //   return this.http.post<User>(url, {email: email, password: encodedPassword}, httpOptions)
  //     .pipe(catchError(this.resetPasswordFailureHandler.bind(this)));
  // }
  //
  //   updateUserLanguage(lang: string) {
  //     const url = this.HOST + '/info/private/settings/userLanguage/update';
  //     return this.httpClient.put(url, {lang: lang}, {observe: 'events'});
  //   }
  //
  //   getUserLanguage(): Observable<string> {
  //     return this.http.get<Map<string, string>>(this.HOST + '/info/private/settings/userLanguage')
  //       .map(map => {
  //         return map['lang'];
  //       });
  // }
  //
  //   isAuthenticated(user: User) {
  //     if (user) {
  //       this.authService.setCurrentUser(user);
  //     }
  //     return user;
  // }

  extractId(body: number) {
    return body;
  }

  handleErrorPromise (error: Response | any) {
    console.error(error.message || error);
    return Promise.reject(error.message || error);
  }

  getUrl(end: string) {
    return this.HOST + '/info/public/v2/' + end;
  }
}

export interface IpAddress {
  ip: string;
}
