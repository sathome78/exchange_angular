import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, Router} from '@angular/router';
import {Observable} from 'rxjs';


@Injectable()
export class BalanceMobileRoutesGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router) { }

  canActivate(): Observable<boolean>|Promise<boolean>|boolean {
    if (this.isMobile) {
      return true;
    }

    this.router.navigate(['/funds/balances']);
    return false;
  }

  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isMobile) {
      return true;
    }

    this.router.navigate(['/funds/balances']);
    return false;
  }

  public get isMobile(): boolean {
    return window.innerWidth <= 1200;
  }

}
