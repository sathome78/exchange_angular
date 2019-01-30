import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {map, catchError} from 'rxjs/operators';
import {PopupService} from '../services/popup.service';
import {Location} from '@angular/common';

@Injectable()
export class RestorePasswordGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService,
              private location: Location,
              private popupService: PopupService) { }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean>|boolean {

    if(this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    const token = route.queryParams['t'];
    this.location.replaceState('recovery-password')
    return this.authService.checkTempToken(token)
      .pipe(
        map((res) => {
          if(!res.data) {
            this.popupService.toggleAlreadyRestoredPasswordPopup(true);
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
