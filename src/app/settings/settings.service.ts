import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {AuthService} from '../shared/services/auth.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NotificationOption} from './email-notification/email-notification.component';
import {NotificationUserSetting} from './two-factor-authenticaton/notification-user-setting.model';

@Injectable()
export class SettingsService {

  apiUrl = environment.apiUrl;
  NICKNAME = 'nickname';
  SESSION = 'sessionInterval';
  NOTIFICATIONS = 'notifications';

  constructor(private authService: AuthService,
              private http: HttpClient) {}

  updateMainPassword(currentPassword: string, newPassword: string) {
    const encodedCurrPassword = this.authService.encodePassword(currentPassword);
    const encodedNewPassword = this.authService.encodePassword(newPassword);
    const body = {
      currentPassword: encodedCurrPassword,
      newPassword: encodedNewPassword
    };
    return this.http.put(this.getUrl('updateMainPassword'), body);
  }

  getNickname(): Observable<any> {
    return this.http.get<any>(this.getUrl(this.NICKNAME));
  }

  updateNickname(nickname: string) {
    return this.http.put(this.getUrl(this.NICKNAME), {nickname: nickname}, {observe: 'events'});
  }

  getSessionInterval(): Observable<{data: number}> {
    return this.http.get<{data: number}>(this.getUrl(this.SESSION));
  }

  updateSessionInterval(interval: number): Observable<number> {
    return this.http.put<number>(this.getUrl(this.SESSION), {sessionInterval: interval});
  }

  getEmailNotifications(): Observable<Map<string, boolean>> {
    return this.http.get<Map<string, boolean>>(this.getUrl(this.NOTIFICATIONS));
  }

  updateEmailNotifications(options: NotificationOption[]): Observable<number> {
    return this.http.put<number>(this.getUrl(this.NOTIFICATIONS), options);
  }

  public updateUserColorScheme(colorScheme: string): Observable<number> {
    const body = {'SCHEME': colorScheme};
    return this.http.put<number>(this.getUrl('color-schema'), body);
  }

  public updateUserColorDepth(isLowColorEnabled: boolean): Observable<number> {
    const body = {'STATE': isLowColorEnabled};
    return this.http.put<number>(this.getUrl('isLowColorEnabled'), body);
  }

  private getUrl(end: string) {
    return this.apiUrl + '/info/private/v2/settings/' + end;
  }

  public getCurrentVerificationStatusKYC() {
    return this.http.get<string>(`${this.apiUrl}/info/private/v2/shufti-pro/current-step`);
  }
  public getCountriesKYC() {
    return this.http.get(`${this.apiUrl}/info/private/v2/shufti-pro/countries`);
  }
  public getLanguagesKYC() {
    return this.http.get(`${this.apiUrl}/info/private/v2/shufti-pro/languages`);
  }
  public getIframeUrlForKYC(step: string, lang: string, country: string) {
    return this.http.get(`${this.apiUrl}/info/private/v2/shufti-pro/verification-url/${step}`, {
     responseType: 'text',
      params: {
        language_code: lang,
        country_code: country
      }
    });
  }

}

interface INotificationOption {

  event: string;
  userId: number;
  sendNotification: boolean;
  sendEmail: boolean;
  eventLocalized: string;

}



