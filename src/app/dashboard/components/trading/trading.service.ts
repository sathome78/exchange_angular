import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

import {environment} from 'environments/environment';
import {Order} from './order.model';

@Injectable()
export class TradingService {

  /** emit on change tabs sell/buy in trading-component */
  public tradingChangeSellBuy$ = new Subject();
  /** emit order when created in trading-component */
  public tradingCreateOrder$ = new Subject();
  public needSetDefaultOrderBookItem = true;
  private apiUrl;

  constructor(
    private http: HttpClient
  ) {
    this.apiUrl = environment.apiUrl;
  }

  createOrder(order: Order): Observable<any> {
     return this.http.post(`${this.apiUrl}/info/private/v2/dashboard/order`, order );
  }

  getCommission(orderType: string, currencyPairId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/info/private/v2/dashboard/commission/${orderType}/${currencyPairId}`);
  }

  updateOrder(order: Order): Observable<any> {
    return this.http.put(`${this.apiUrl}/info/private/v2/dashboard/order`, order);
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/info/private/v2/dashboard/order/${orderId}`);
  }
}
