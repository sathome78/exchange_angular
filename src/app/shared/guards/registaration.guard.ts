import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {map, catchError, switchMap} from 'rxjs/operators';
import {PopupService} from '../services/popup.service';
import {Location} from '@angular/common';

@Injectable()
export class RegistrationGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService,
              private location: Location,
              private popupService: PopupService) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean>|boolean {
     return this.authService.isSessionValid()
      .pipe(switchMap((res) => {
        if(!res) {
          const token = route.queryParams['t'];
          this.location.replaceState('final-registration/token')
          return this.authService.checkTempToken(token);
        }
        this.router.navigate(['/dashboard']);
        return of(false);
      }))
      .pipe(
        map((res) => {
          if(res && res.data) {
            return true;
          }
          if(res && !res.data) {
            this.popupService.toggleAlreadyRegisteredPopup( true);
            this.router.navigate(['/dashboard']);
            return false;
          }
          return false;
        }),
        catchError((err) => {
          console.error(err);
          this.router.navigate(['/dashboard']);
          return of(false);
        })
      );
  }
}
