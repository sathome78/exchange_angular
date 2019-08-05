import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {
  EXRATES_REST_TOKEN,
  IP_CHECKER_URL,
  TOKEN,
  X_FORWARDED_FOR,
  USER_IP,
  X_AUTH_TOKEN
} from 'app/shared/services/http.utils';

export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clientIp = localStorage.getItem(USER_IP) || '';
    let headers;
    let copiedReq;
    if (localStorage.getItem(TOKEN) && req.url !== IP_CHECKER_URL) {
      const token = localStorage.getItem(TOKEN);
      headers = req.headers
        .append('Content-Type', 'application/json')
        .append(X_AUTH_TOKEN, token)
        .append(EXRATES_REST_TOKEN, token)
        .append(X_FORWARDED_FOR, clientIp);

      copiedReq = req.clone({
        headers,
      });
      return next.handle(copiedReq);
    }

    headers = req.headers.append('Content-Type', 'application/json').append(X_FORWARDED_FOR, clientIp);
    copiedReq = req.clone({
      headers,
    });
    return next.handle(copiedReq);
  }
}
