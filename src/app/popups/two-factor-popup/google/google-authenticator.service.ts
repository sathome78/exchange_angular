import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {MEDIA_TYPE_JSON} from '../../../services/http.utils';
import {Observable} from 'rxjs';
import {ITwoFaResponseDto} from './2fa-response-dto.model';

@Injectable()
export class GoogleAuthenticatorService {

  HOST = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getGoogleTwoFaSecretHash(): Observable<ITwoFaResponseDto> {
    return this.http.get<ITwoFaResponseDto>(this.getUrl('google2fa/hash'), {headers: MEDIA_TYPE_JSON});
  }

  getUrl(end: string): string {
    return this.HOST + '/info/private/v2/2FaOptions/' + end;
  }

}
