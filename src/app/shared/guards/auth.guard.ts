import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isSessionValid().pipe(
      map(res => {
        if (res) {
          // logged in - therefore access granted
          return true;
        }
        // otherwise redirected to login page
        this.router.navigate(['/dashboard']);
        return false;
      })
    );
  }

  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isSessionValid().pipe(
      map(res => {
        if (res) {
          return true;
        }
        this.router.navigate(['/dashboard']);
        return false;
      })
    );
  }
}
