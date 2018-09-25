import {Injectable} from '@angular/core';
import {User} from '../model/user.model';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {MEDIA_TYPE_JSON} from './http.utils';
import {LangService} from './lang.service';
import {AuthCandidate} from '../model/auth-candidate.model';
import {LoggingService} from './logging.service';
import {TokenHolder} from '../model/token-holder.model';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class UserService {

  HOST = environment.apiUrl;

  constructor(private http: HttpClient,
              private authService: AuthService,
              private langService: LangService,
              private logger: LoggingService,
              private router: Router) {
  }

  getIfEmailExists(email: string): Observable<boolean> {
    const url = this.HOST + '/info/public/if_email_exists';
    const httpOptions = {
      headers: MEDIA_TYPE_JSON,
      params:  new HttpParams().set('email', email)
    };
    return this.http.get<boolean>(url, httpOptions);
  }

  getIfUsernameExists(username: string): Observable<any> {
    const url = this.HOST + '/info/public/if_username_exists';
    const httpOptions = {
      headers: MEDIA_TYPE_JSON,
      params:  new HttpParams().set('username', username)
    };
    return this.http.get<string[]>(url, httpOptions);
  }

  getIfConnectionSuccessful(): Observable<boolean> {
    const url = this.HOST + '/info/public/test';
    const httpOptions = {
      headers: MEDIA_TYPE_JSON
    };
    return this.http.get<boolean>(url, httpOptions);
  }

  createNewUser(username: string, email: string,
                password: string, language: string,
                sponsor?: string): Promise<number> {

    const url = this.HOST + '/info/public/register';
    const registrate = {
      'nickname': username,
      'email': email,
      'password': this.authService.encodePassword(password),
      'language': this.langService.getLanguage(),
      'sponsor': (sponsor) ? sponsor : ''
    };
    const httpOptions = {
      headers: MEDIA_TYPE_JSON
    };
    return this.http.post<number>(url, JSON.stringify(registrate), httpOptions)
      .toPromise()
      .then(this.extractId)
      .catch(this.handleErrorPromise);
  }

  authenticateUser(email: string, password: string, pin?: string): Observable<{} | TokenHolder> {
    const authCandidate = new AuthCandidate(email, password);
    this.logger.debug(this, 'User password ' + password + ' is encrypted to ' + authCandidate.password);
    const url = this.HOST + '/info/public/authenticate';
    const mHeaders = MEDIA_TYPE_JSON.append('X-Forwarded-For', localStorage.getItem('client_ip'));
    const mParams = new HttpParams();

    if (pin) {
      mParams.set('checkPin', pin);
    }
    const httpOptions = {
      headers: mHeaders,
      params: mParams
    };

    return this.http.post<TokenHolder>(url, JSON.stringify(authCandidate), httpOptions);
  }

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
}
