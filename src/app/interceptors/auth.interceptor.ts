import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {
  CORS_HEADER,
  EXRATES_REST_TOKEN,
  IP_CHECKER_URL,
  IP_USER_HEADER,
  MEDIA_TYPE_JSON,
  TOKEN,
  X_AUTH_TOKEN
} from '../services/http.utils';

export class AuthInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (localStorage.getItem(TOKEN) && req.url !== IP_CHECKER_URL) {
      const token = localStorage.getItem(TOKEN);
      const clientIp = localStorage.getItem(IP_USER_HEADER) ? localStorage.getItem(IP_USER_HEADER) : '192.168.0.1';
      const headers = req.headers
                                .append('Content-Type', 'application/json')
                                .append(X_AUTH_TOKEN, token)
                                .append(EXRATES_REST_TOKEN, token)
                                // .append(CORS_HEADER, '*');
                                // .append(IP_USER_HEADER, clientIp);
                                .append(IP_USER_HEADER, '192.168.0.1');

      const copiedReq = req.clone({
        headers: headers
      });
      // console.log(copiedReq);
      return next.handle(copiedReq);
    } else {
      const copiedReq = req.clone({
        headers: MEDIA_TYPE_JSON
      });
      return next.handle(copiedReq);
    }
  }

}
