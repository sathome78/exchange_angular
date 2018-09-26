import 'rxjs/add/operator/do';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TOKEN } from '../services/http.utils';


export class JwtInterceptor implements HttpInterceptor {

  // constructor(private router: Router) {}

  // found out that the only possible way to avoid to cyclic dependencies
  // is not making it injectable or inject others services here
  // solution: to put or remove anything to local storage

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
        // maybe to refresh token after approved secure activity
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          // redirect to the login route
          // or show a modal
          // this.router.navigate(['/']);
        } else if (err.status === 403) {
          // cause: "TokenException"   detail:"Token not found" - happens when token expires
          // clear token remove user from local storage to log out user
          localStorage.removeItem(TOKEN);
        }
      }
    });
  }
}
