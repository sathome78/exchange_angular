import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {AuthService} from '../services/auth.service';
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

  updateMainPassword(pass: string) {
    const encodedPassword = this.authService.encodePassword(pass);
    return this.http.put(this.getUrl('updateMainPassword'), {password: encodedPassword}, {observe: 'events'});
  }

  getNickname(): Observable<any> {
    return this.http.get<any>(this.getUrl(this.NICKNAME));
  }

  updateNickname(nickname: string) {
    return this.http.put(this.getUrl(this.NICKNAME), {nickname: nickname}, {observe: 'events'});
  }

  getSessionInterval(): Observable<number> {
    return this.http.get<number>(this.getUrl(this.SESSION));
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

  public updateUserNotificationSettings(enabled: boolean): Observable<number> {
    const body: {'STATE': boolean} = {'STATE': enabled};
    return this.http.put<number>(this.apiUrl + '/info/private/v2/2FaOptions/google2fa', body);
  }

  private getUrl(end: string) {
    return this.apiUrl + '/info/private/v2/settings/' + end;
  }

}

interface INotificationOption {

  event: string;
  userId: number;
  sendNotification: boolean;
  sendEmail: boolean;
  eventLocalized: string;

}



