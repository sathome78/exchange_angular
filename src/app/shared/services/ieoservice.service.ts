import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { KycIEOModel } from '../../ieo/models/ieo-kyc.model';
import { IEOSuccessBuyModel } from '../../ieo/models/ieo-success-buy';
import { map } from 'rxjs/operators';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class IEOServiceService {
  private  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private stompService: RxStompService,
  ) { }

  public checkKYC(): Observable<KycIEOModel> {
    return this.http.get<ResponseModelIEO<KycIEOModel>>(`${this.apiUrl}/api/private/v2/ieo/check`)
      .pipe(map((res) => res.data));
  }

  public setPolicy(id): Observable<ResponseModelIEO<boolean>> {
    return this.http.put<ResponseModelIEO<boolean>>(`${this.apiUrl}/api/private/v2/dashboard/policy/${id}`, {});
  }

  public buyTokens(data: {currencyName: string, amount: string}): Observable<ResponseModelIEO<IEOSuccessBuyModel>> {
    return this.http.put<ResponseModelIEO<IEOSuccessBuyModel>>(`${this.apiUrl}/api/private/v2/kyc/claim`, data);
  }

  public getListIEO(): any {
    return this.stompService
      .watch(`/app/queue/ieo_details`)
      .pipe(map((message: Message) => JSON.parse(message.body)));
  }

  public getIEO(id): any {
    return this.stompService
      .watch(`/app/queue/ieo_details/${id}`)
      .pipe(map((message: Message) => JSON.parse(message.body)));
  }
}
