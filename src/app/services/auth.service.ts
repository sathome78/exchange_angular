import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {TokenHolder} from '../model/token-holder.model';
import {LoggingService} from './logging.service';

import * as jwt_decode from 'jwt-decode';
import {t} from '@angular/core/src/render3';

declare var encodePassword: Function;

@Injectable()
export class AuthService {

  ENCODE_KEY = environment.encodeKey;
  isAuthenticatedUser: boolean;

  private tokenHolder: TokenHolder;
  public TOKEN = 'token';
  public simpleToken: {expiration: number, token_id: number, username: string, value: string};

  constructor(private logger: LoggingService) {}


  public isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN);
    if (token) {
      this.logger.debug(this, 'Token from local storage: ' + token.substring(0, 6));
      this.parseToken(token);
      return this.isTokenExpired();
    }
    return false;
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

  private parseToken(token: string): void {
    this.simpleToken = jwt_decode(token);
    this.logger.debug(this, 'Simple token: ' + JSON.stringify(this.simpleToken));
  }

  private isTokenExpired() {
    if (this.simpleToken.expiration) {
      const tokenExpiresAt = new Date(this.simpleToken.expiration);
      this.logger.debug(this, 'Token expires at: ' + tokenExpiresAt);
      return tokenExpiresAt >= new Date();
    }
    return false;
  }
}
