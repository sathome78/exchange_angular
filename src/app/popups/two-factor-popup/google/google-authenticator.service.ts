import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {ITwoFaResponseDto} from './2fa-response-dto.model';

declare var encodePassword: Function;

@Injectable()
export class GoogleAuthenticatorService {

  HOST = environment.apiUrl;
  ENCODE_KEY = environment.encodeKey;

  constructor(private http: HttpClient) {
  }

  getGoogleTwoFaSecretHash(): Observable<ITwoFaResponseDto> {
    return this.http.get<ITwoFaResponseDto>(this.getUrl('google2fa/hash'));
  }

  sendMePincode(): Observable<number> {
    return this.http.get<number>(this.getUrl('google2fa/pin'));
  }

  submitGoogleAuthSecret(secret: string, password: string, pin: string): Observable<number> {
    const encodedPassword = encodePassword(password, this.ENCODE_KEY);
    const body: { 'SECRET': string, 'PASSWORD': string, 'PINCODE': string }
      = {'SECRET': secret, 'PASSWORD': encodedPassword, 'PINCODE': pin};
    return this.http.post<number>(this.getUrl('google2fa/submit'), body);
  }

  disableGoogleAuthentication( password: string, pin: string): Observable<number> {
    const encodedPassword = encodePassword(password, this.ENCODE_KEY);
    const body: { 'PASSWORD': string, 'PINCODE': string }
      = { 'PASSWORD': encodedPassword, 'PINCODE': pin};
    return this.http.put<number>(this.getUrl('google2fa/disable'), body);
  }

  getUrl(end: string): string {
    return this.HOST + '/api/private/v2/2FaOptions/' + end;
  }

}
