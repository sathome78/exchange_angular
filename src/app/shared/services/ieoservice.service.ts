import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { KycIEOModel } from '../../ieo/models/ieo-kyc.model';
import { IEOSuccessBuyModel } from '../../ieo/models/ieo-success-buy';
import { map } from 'rxjs/operators';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { TOKEN } from './http.utils';

@Injectable({
  providedIn: 'root'
})
export class IEOServiceService {
  private  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private stompService: RxStompService,
  ) { }

  public checkKYC(id): Observable<KycIEOModel> {
    return this.http.get<ResponseModelIEO<KycIEOModel>>(`${this.apiUrl}/api/private/v2/ieo/check/${id}`)
      .pipe(map((res) => res.data));
  }

  public setPolicy(id): Observable<ResponseModelIEO<boolean>> {
    return this.http.put<ResponseModelIEO<boolean>>(`${this.apiUrl}/api/private/v2/dashboard/policy/ieo`, {});
  }

  public buyTokens(data: {currencyName: string, amount: string}, name: string): Observable<ResponseModelIEO<IEOSuccessBuyModel>> {
    return this.http.post<ResponseModelIEO<IEOSuccessBuyModel>>(`${this.apiUrl}/api/private/v2/${name}/claim`, data);
  }

  public getListIEO(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/public/v2/ieo`);
  }

  public getListIEOTab(): any {
    return this.stompService
      .watch(`/user/queue/ieo_details`, {'Exrates-Rest-Token': localStorage.getItem(TOKEN) || ''})
      .pipe(map((message: Message) => JSON.parse(message.body)));
  }

  public getIEO(id): any {
    return this.stompService
      .watch(`/app/ieo/ieo_details/${id}`)
      .pipe(map((message: Message) => JSON.parse(message.body)));
  }
}
