import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {map, catchError} from 'rxjs/operators';
import {PopupService} from '../services/popup.service';

@Injectable()
export class RegistrationGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService,
              private popupService: PopupService) { }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean>|boolean {
    const token = route.queryParams['t'];
    return this.authService.checkTempToken(token)
      .pipe(
        map((res) => {
          if(!res.data) {
            this.popupService.toggleAlreadyRegisteredPopup(true);
            this.router.navigate(['/dashboard']);
            return false;
          }
          return res.data
        }),
        catchError((err) => {
          console.error(err);
          this.router.navigate(['/dashboard']);
          return of(false);
        })
      );
  }
}
