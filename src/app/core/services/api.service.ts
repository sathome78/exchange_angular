import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {ApiResponse} from '../models/api.response';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {TokenStorage} from '../../auth/helpers/token.storage';
import {AuthHelper} from '../../auth/helpers/auth.helper';

const headers = new HttpHeaders();
headers.append('Content-Type', 'application/json');

@Injectable()
export class ApiService {

  /**
   * Default constructor
   * @param http
   * @param router
   */
  constructor(private http: HttpClient,
              private router: Router, private authHelper: AuthHelper) {
  }

  /**
   * Performs request via post method
   * @param url
   * @param body
   * @param options
   * @return {Observable<ApiResponse>}
   */
  post(url: string, body: any, options?: { params: HttpParams }): Observable<ApiResponse> {
    // console.log('POST', url);
    return this.http.post(this.url(url), body, {headers, ...options})
      .map(res => new ApiResponse(res))
      // .do(res => console.log(res))
      .catch((err: Response) => {
        if (err.status == 401) {
          this.authHelper.clearAuthToken();
          this.router.navigate(['/']);

        } else if (err.status >= 400 && err.status != 404) {
          this.router.navigate(['/under-maintenance']);
        }
        console.error(err);
        return Observable.empty<ApiResponse>();
      });
  }

  /**
   * Performs get request
   * @param url
   * @param options
   * @return {Observable<ApiResponse>}
   */
  get(url: string, options?: { params: HttpParams }): Observable<ApiResponse> {
    // console.log('GET', this.url(url), options);
    return this.http.get(this.url(url), {headers, ...options})
      .map(res => new ApiResponse(res))
      // .do(res => console.log(res))
      .catch((err: Response) => {
        if (err.status == 401) {
          this.authHelper.clearAuthToken();
          this.router.navigate(['/']);

        } else if (err.status >= 400 && err.status != 404) {
          this.router.navigate(['/under-maintenance']);
        }
        console.error(err);
        return Observable.empty<ApiResponse>();
      });
  }

  /**
   * Performs get request using non authenticated http
   * @param url
   * @param options
   * @return {Observable<ApiResponse>}
   */
  noAuthGet(url: string, options?: { params: HttpParams }): Observable<ApiResponse> {
    // console.log('NOAUTHGET', url);
    return this.http.get(this.url(url), {headers, ...options})
      .map(res => new ApiResponse(res))
      // .do(res => console.log('NA res', res))
      .catch((err: Response) => {
        console.error(err.text);
        return Observable.empty<ApiResponse>();
      });
  }

  /**
   * Returns qualified URL
   * @param url
   * @return {string}
   */
  private url(url: string) {
    const apiUrl = environment.apiUrl;
    // hack
    if (url.length && url[0] != '/') {
      url = '/' + url;
    }

    return apiUrl + url;
  }
}
