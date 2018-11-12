import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {TokenHolder} from '../model/token-holder.model';
import {LoggingService} from './logging.service';

import * as jwt_decode from 'jwt-decode';
import {TOKEN} from './http.utils';

declare var encodePassword: Function;

@Injectable()
export class AuthService {

  ENCODE_KEY = environment.encodeKey;

  private tokenHolder: TokenHolder;
  public simpleToken: {expiration: number, token_id: number, username: string, value: string};

  constructor(private logger: LoggingService) {}


  public isAuthenticated(): boolean {
    // localStorage.setItem(TOKEN, 'eyJhbGciOiJIUzUxMiJ9.eyJ0b2tlbl9pZCI6MjQsImNsaWVudF9pcCI6IjA6MDowOjA6MDowOjA6MSIsImV4cGlyYXRpb24iOjE1MzkwNzUzMTEyMTgsInZhbHVlIjoiOWNjOWY4MDMtMGQ1MC00ODkzLWI4MGYtMWE2YzJiNzBjMWJhIiwidXNlcm5hbWUiOiJvbGVnX3BvZG9saWFuQHVrci5uZXQifQ.GkkgSI_VsHtBiMn1sRVKfZiIQ5hvvOQuTz7OSdK7LCOJP_l72gh0FFP6xizTQDJ3z6DV_O0zitt7DTLS7BL0rg');
    const token = localStorage.getItem(TOKEN);
    if (token) {
      this.logger.debug(this, 'Token from local storage: ' + token.substring(0, 6));
      this.parseToken(token);
      return this.isTokenExpired();
    }
    return false;
  }

  onLogOut() {
    this.simpleToken = {expiration: 0, username: '', token_id: 0, value: ''};
    localStorage.removeItem(TOKEN);
    location.reload();
  }

  encodePassword(password: string) {
    return encodePassword(password, this.ENCODE_KEY);
  }

  public setTokenHolder(tokenHolder: TokenHolder) {
    this.tokenHolder = tokenHolder;
    if (tokenHolder.token) {
      localStorage.setItem(TOKEN, tokenHolder.token);
    }
  }

  private parseToken(token: string): void {
    this.simpleToken = jwt_decode(token);
    this.logger.debug(this, 'Simple token: ' + JSON.stringify(this.simpleToken));
  }

  private isTokenExpired() {
    if (this.simpleToken.expiration) {
      const tokenExpiresAt = new Date(this.simpleToken.expiration);
      this.logger.debug(this, 'Token expires at: ' + this.logger.formatDate(tokenExpiresAt));
      return tokenExpiresAt >= new Date();
    }
    return false;
  }

  public getUsername(): string {
    if (this.simpleToken) {
      return this.simpleToken.username;
    }
    return undefined;
  }

  public onLogIn() {}
}
