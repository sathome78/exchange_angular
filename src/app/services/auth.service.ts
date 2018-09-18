import {Injectable} from '@angular/core';

@Injectable()
export class AuthService {

  isAuthenticatedUser: boolean;


  public isAuthenticated(): boolean {
    return this.isAuthenticatedUser;
  }

  onLogOut() {
    this.isAuthenticatedUser = false;
  }

  onLogIn() {
    this.isAuthenticatedUser = true;
  }


}
