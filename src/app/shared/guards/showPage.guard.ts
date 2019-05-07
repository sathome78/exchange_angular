import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, Router} from '@angular/router';
import {environment} from 'environments/environment';

@Injectable()
export class ShowPageGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
  ) { }

  canActivate(): boolean {
    if(environment.showContent) {
      return environment.showContent;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }

  canActivateChild(): boolean {
    if(environment.showContent) {
      return environment.showContent;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
