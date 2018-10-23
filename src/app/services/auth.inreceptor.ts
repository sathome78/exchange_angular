import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

export class AuthInreceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return undefined;
  }

}
// token = this.auth.getToken() // auth is provided via constructor.
// if (token) {
//   req.setHeader('Authorization', 'Bearer ' + token)
// }
// return next.handle(req);
