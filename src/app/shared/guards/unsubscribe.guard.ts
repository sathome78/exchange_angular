import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from '../services/user.service';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class UnsubscribeGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const token = route.queryParams['token'];
    const publicId = route.queryParams['public_id'];

    return this.userService.unsubscribeMail(token || null, publicId || null, false)
      .pipe(
        map(res => {
          return true;
        }),
        catchError(err => {
          this.router.navigate(['/dashboard']);
          return of(false);
        })
      );
  }

}
