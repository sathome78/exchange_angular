import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {TOKEN} from './http.utils';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router,
              private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    // if (localStorage.getItem(TOKEN)
    //     && this.authService.isAuthenticated()) {
    //   // logged in - therefore access granted
    //   console.log('this.authService.isAuthenticated()');
    //   return true;
    // }

    // otherwise redirected to login page
    this.router.navigate(['/dashboard']);
    // this.router.navigate(['/settings']);
    return false;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // if (this.authService.isAuthenticated()) {
    //   console.log('this.authService.isAuthenticated()');
    //   return true;
    // }
    this.router.navigate(['/dashboard']);
    // this.router.navigate(['/settings']);
    return false;
  }

}
