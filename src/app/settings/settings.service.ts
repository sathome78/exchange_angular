import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../shared/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationOption } from './email-notification/email-notification.component';
import { NotificationUserSetting } from './two-factor-authenticaton/notification-user-setting.model';
import { BankVerification } from 'app/model/bank-veryfication.model';
import { SessionHistoryItem } from 'app/model/session-history.model';

@Injectable()
export class SettingsService {
  apiUrl = environment.apiUrl;
  NICKNAME = 'nickname';
  SESSION = 'sessionInterval';
  NOTIFICATIONS = 'notifications';

  constructor(private authService: AuthService, private http: HttpClient) {}

  updateMainPassword(currentPassword: string, newPassword: string) {
    const encodedCurrPassword = this.authService.encodePassword(currentPassword);
    const encodedNewPassword = this.authService.encodePassword(newPassword);
    const body = {
      currentPassword: encodedCurrPassword,
      newPassword: encodedNewPassword,
    };
    return this.http.put(this.getUrl('updateMainPassword'), body);
  }

  getNickname(): Observable<any> {
    return this.http.get<any>(this.getUrl(this.NICKNAME));
  }

  updateNickname(nickname: string) {
    return this.http.put(this.getUrl(this.NICKNAME), { nickname }, { observe: 'events' });
  }

  getSessionInterval(): Observable<{ data: number }> {
    return this.http.get<{ data: number }>(this.getUrl(this.SESSION));
  }

  updateSessionInterval(interval: number): Observable<number> {
    return this.http.put<number>(this.getUrl(this.SESSION), {
      sessionInterval: interval,
    });
  }

  getEmailNotifications(): Observable<Map<string, boolean>> {
    return this.http.get<Map<string, boolean>>(this.getUrl(this.NOTIFICATIONS));
  }

  updateEmailNotifications(options: NotificationOption[]): Observable<number> {
    return this.http.put<number>(this.getUrl(this.NOTIFICATIONS), options);
  }

  public updateUserColorScheme(colorScheme: string): Observable<number> {
    const body = { SCHEME: colorScheme };
    return this.http.put<number>(this.getUrl('color-schema'), body);
  }

  public updateUserColorDepth(isLowColorEnabled: boolean): Observable<number> {
    const body = { STATE: isLowColorEnabled };
    return this.http.put<number>(this.getUrl('isLowColorEnabled'), body);
  }

  private getUrl(end: string) {
    return `${this.apiUrl}/api/private/v2/settings/${end}`;
  }

  public getCurrentVerificationStatusKYC() {
    return this.http.get<{ data: string }>(`${this.apiUrl}/api/private/v2/kyc/status`);
  }

  public getCountriesKYC() {
    return this.http.get(`${this.apiUrl}/api/private/v2/kyc/countries`);
  }

  public getLanguagesKYC() {
    return this.http.get(`${this.apiUrl}/api/private/v2/kyc/languages`);
  }

  public getIframeUrlForKYC(lang: string, country: string) {
    return this.http.get(`${this.apiUrl}/api/private/v2/kyc/verification-url`, {
      responseType: 'text',
      params: {
        language_code: lang,
        country_code: country,
      },
    });
  }

  public postBankVerification(verify: BankVerification) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token,
    });
    const options = { headers };
    console.log(options);

    return this.http.post(`${this.apiUrl}/api/private/v2/merchants/qubera/account/create`, verify, options);
  }

  public getSessionHistory(): Observable<ResponseModel<SessionHistoryItem[]>> {
    return this.http.get<ResponseModel<SessionHistoryItem[]>>(`${this.apiUrl}/api/private/v2/settings/sessions`);
  }
}

interface INotificationOption {
  event: string;
  userId: number;
  sendNotification: boolean;
  sendEmail: boolean;
  eventLocalized: string;
}
