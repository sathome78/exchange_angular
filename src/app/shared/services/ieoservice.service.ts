import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { KycIEOModel } from '../../ieo/models/ieo-kyc.model';
import { IEOSuccessBuyModel } from '../../ieo/models/ieo-success-buy';
import { map } from 'rxjs/operators';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { TOKEN } from './http.utils';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class IEOServiceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private stompService: RxStompService, private authService: AuthService) {}

  public checkKYC(id): Observable<KycIEOModel> {
    return this.http.get<ResponseModelIEO<KycIEOModel>>(`${this.apiUrl}/api/private/v2/ieo/check/${id}`)
      .pipe(map(res => res.data));
  }

  public setPolicy(id): Observable<ResponseModelIEO<boolean>> {
    return this.http.post<ResponseModelIEO<boolean>>(`${this.apiUrl}/api/private/v2/ieo/policy/check/${id}`, {});
  }

  public buyTokens(data: { currencyName: string; amount: string }): Observable<ResponseModelIEO<IEOSuccessBuyModel>> {
    return this.http.post<ResponseModelIEO<IEOSuccessBuyModel>>(`${this.apiUrl}/api/private/v2/ieo/claim`, data);
  }

  public getListIEO(): Observable<any> {
    // return this.http.get<any>(`${this.apiUrl}/api/public/v2/ieo`);
    return this.stompService.watch(`/app/ieo/ieo_details`).pipe(map((message: Message) => JSON.parse(message.body)));
  }
  public refreshIEOStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/public/v2/ieo/refresh`);
  }

  public getListIEOTab(publicId): any {
    return this.stompService
      .watch(`/app/ieo_details/private/${publicId}`, {
        'Exrates-Rest-Token': this.authService.token || '',
      })
      .pipe(map((message: Message) => JSON.parse(message.body)));
  }

  public getIEO(id): any {
    return this.stompService.watch(`/app/ieo/ieo_details/${id}`)
      .pipe(map((message: Message) => {
        if (message.body === 'none') {
          return null;
        }
        return JSON.parse(message.body);
      }));
  }

  ieoEmailSubscription(email: string) {
    const data = { email };
    return this.http.post(`${this.apiUrl}/api/public/v2/ieo/subscribe/email`, data);
  }

  ieoTelegramRedirect(email: string) {
    const data = { email };
    return this.http.post(`${this.apiUrl}/api/public/v2/ieo/subscribe/telegram`, data);
  }

  ieoCheckSubscribe(email: string) {
    const encodedEmail = encodeURIComponent(email);
    const httpOptions = {
      params: new HttpParams().set('email', encodedEmail),
    };
    return this.http.get(`${this.apiUrl}/api/public/v2/ieo/subscribe`, httpOptions);
  }
}
