import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {
  EXRATES_REST_TOKEN,
  IP_CHECKER_URL,
  TOKEN,
  X_AUTH_TOKEN
} from 'app/shared/services/http.utils';

export class AuthInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (localStorage.getItem(TOKEN) && req.url !== IP_CHECKER_URL) {
      const token = localStorage.getItem(TOKEN);
      const headers = req.headers
        .append('Content-Type', 'application/json')
        .append(X_AUTH_TOKEN, token)
        .append(EXRATES_REST_TOKEN, token);
      // .append(CORS_HEADER, '*');
      // .append(IP_USER_KEY, clientIp);
      // .append(IP_USER_HEADER, '192.168.0.1');

      const copiedReq = req.clone({
        headers: headers,
      });
      return next.handle(copiedReq);
    } else {
      let headers;
      headers = req.headers
        .append('Content-Type', 'application/json');
      const copiedReq = req.clone({
        headers,
      });
      return next.handle(copiedReq);
    }
  }

}
