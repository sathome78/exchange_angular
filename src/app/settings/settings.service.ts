import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {AuthService} from '../services/auth.service';
import {MEDIA_TYPE_JSON} from '../services/http.utils';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class SettingsService {

  apiUrl = environment.apiUrl;
  NICKNAME = 'nickname';
  SESSION = 'sessionInterval';

  constructor(private authService: AuthService,
              private http: HttpClient) {}

  updateMainPassword(pass: string) {
    const encodedPassword = this.authService.encodePassword(pass);
    return this.http.put(this.getUrl('updateMainPassword'), {password: encodedPassword}, {observe: 'events', headers: MEDIA_TYPE_JSON});
  }

  getNickname(): Observable<any> {
    return this.http.get<any>(this.getUrl(this.NICKNAME), {headers: MEDIA_TYPE_JSON});
  }

  updateNickname(nickname: string) {
    return this.http.put(this.getUrl(this.NICKNAME), {nickname: nickname}, {observe: 'events', headers: MEDIA_TYPE_JSON});
  }

  getSessionInterval(): Observable<number> {
    return this.http.get<number>(this.getUrl(this.SESSION), {headers: MEDIA_TYPE_JSON});
  }

  updateSessionInterval(interval: number): Observable<number> {
    return this.http.put<number>(this.getUrl(this.SESSION), {sessionInterval: interval}, {headers: MEDIA_TYPE_JSON});
  }

  private getUrl(end: string) {
    return this.apiUrl + '/info/private/v2/settings/' + end;
  }





}


