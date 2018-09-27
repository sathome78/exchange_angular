import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {AuthService} from '../services/auth.service';
import {MEDIA_TYPE_JSON} from '../services/http.utils';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class SettingsService {

  apiUrl = environment.apiUrl;

  constructor(private authService: AuthService,
              private http: HttpClient) {}

  updateMainPassword(pass: string) {
    const url = this.apiUrl + '/info/private/settings/updateMainPassword';
    const encodedPassword = this.authService.encodePassword(pass);
    return this.http.put(url, {password: encodedPassword}, {observe: 'events', headers: MEDIA_TYPE_JSON});
  }

  getNickname(): Observable<any> {
    const url = this.apiUrl + '/info/private/settings/nickname';
    return this.http.get<any>(url, {headers: MEDIA_TYPE_JSON});
  }


}


