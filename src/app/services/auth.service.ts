import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {TokenHolder} from '../model/token-holder.model';

declare var encodePassword: Function;

@Injectable()
export class AuthService {

  ENCODE_KEY = environment.encodeKey;
  isAuthenticatedUser: boolean;

  private tokenHolder: TokenHolder;
  public TOKEN = 'token';


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

  public setTokenHolder(tokenHolder: TokenHolder) {
    this.tokenHolder = tokenHolder;
    if (tokenHolder.token) {
      localStorage.setItem(this.TOKEN, tokenHolder.token);
    }
  }
}
