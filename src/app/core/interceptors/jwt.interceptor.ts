import 'rxjs/add/operator/do';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { TOKEN } from 'app/shared/services/http.utils';
import { AuthService } from 'app/shared/services/auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PopupService } from 'app/shared/services/popup.service';

export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private popupService: PopupService) {}

  // found out that the only possible way to avoid to cyclic dependencies
  // is not making it injectable or inject others services here
  // solution: to put or remove anything to local storage

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
            // maybe to refresh token after approved secure activity
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              // redirect to the login route
              // or show a modal
              // this.router.navigate(['/']);
            } else if (err.status === 403) {
              // cause: "TokenException"   detail:"Token not found" - happens when token expires
              // clear token remove user from local storage to log out user
              this.authService.onLogOut();
              this.popupService.toggleSessionExpiredPopup(true);
            }
          }
        }
      )
    );
  }
}
