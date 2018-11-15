import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {IP_USER_HEADER, IP_USER_KEY} from './http.utils';
import {LangService} from './lang.service';
import {AuthCandidate} from '../model/auth-candidate.model';
import {LoggingService} from './logging.service';
import {TokenHolder} from '../model/token-holder.model';
import {Router} from '@angular/router';
import {CurrencyPair} from '../model/currency-pair.model';
import {tap} from 'rxjs/internal/operators';
import {Store} from '@ngrx/store';
import {State} from '../dashboard/reducers/dashboard.reducer';
import {RefreshUserBalanceAction} from '../dashboard/actions/dashboard.actions';

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

  checkIfUsernameExists(username: string): Observable<any> {
    const httpOptions = {
      params:  new HttpParams().set('username', username)
    };
    return this.http.get<string[]>(this.getUrl('if_username_exists'), httpOptions);
  }

  public getUserBalance(pair: CurrencyPair) {
    if (this.authService.isAuthenticated()) {
      return this.http.get(`${this.HOST}/info/private/v2/dashboard/info/${pair.currencyPairId}`)
        .pipe(tap(info => this.store.dispatch(new RefreshUserBalanceAction(info))));
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

  public authenticateUser(email: string, password: string, pin?: string): Observable<{} | TokenHolder> {
    console.log(email, password, pin)
    const authCandidate = AuthCandidate
      .builder()
      .withEmail(email)
      .withPassword(password)
      .withPinCode(pin)
      .withClientIp()
      .build();

    this.logger.debug(this, 'User password ' + password + ' is encrypted to ' + authCandidate.password);
    // const mHeaders = MEDIA_TYPE_JSON.append(IP_USER_HEADER, localStorage.getItem('client_ip'));
    const mParams = new HttpParams();

    if (pin) {
      mParams.set('checkPin', pin);
    }
    const httpOptions = {
      params: mParams
    };

    console.log(JSON.stringify(authCandidate));
    return this.http.post<TokenHolder>(this.getUrl('users/authenticate'), JSON.stringify(authCandidate), httpOptions);
  }

  public getUserColorScheme(): Observable<string> {
    const url = this.HOST + '/info/private/v2/settings/color-schema';
    return this.http.get<string>(url);
  }
  public getUserColorEnabled(): Observable<boolean> {
    const url = this.HOST + '/info/private/v2/settings/isLowColorEnabled';
    return this.http.get<boolean>(url);
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
