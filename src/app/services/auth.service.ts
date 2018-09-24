import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

declare var encodePassword: Function;

@Injectable()
export class AuthService {

  ENCODE_KEY = environment.encodeKey;
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


  encodePassword(password: string) {
    return encodePassword(password, this.ENCODE_KEY);
  }
}
