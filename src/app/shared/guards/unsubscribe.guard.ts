import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot } from '@angular/router';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class UnsubscribeGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const token = route.queryParams['token'];
    const publicId = route.queryParams['public_id'];
    const subscribe = route.queryParams['subscribe'];

    // if (token) {
    //   return environment.showContent;
    // } else {
    //   this.router.navigate(['/dashboard']);
    //   return false;
    // }
  }

  handleUserEmail(token) {

  }


}
