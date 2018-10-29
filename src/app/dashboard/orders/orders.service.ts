import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable()
export class OrdersService {

  private baseUrl;

  constructor(
    private http: HttpClient
  ) {
    this.baseUrl = environment.apiUrl;
  }

  getOpenOrders(currencyPairId): Observable<any> {
    return this.http.get(`${this.baseUrl}/info/private/v2/dashboard/orders/OPENED`,
      { params: { currencyPairId: currencyPairId, scope: 'ALL' }});
  }

  getHistory(currencyPairId, status: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/info/private/v2/dashboard/orders/${status}`,
      { params: { currencyPairId, limit: '100', scope: 'ALL' }});
  }

  updateOrder(order): Observable<any> {
    return this.http.put(`${this.baseUrl}/info/private/v2/dashboard/order`, order);
  }

  deleteOrder(order): Observable<any> {
    return this.http.delete(`${this.baseUrl}/info/private/v2/dashboard/order/${order.orderId}`);
  }

  createOrder(order): Observable<any> {
    return this.http.post(`${this.baseUrl}/info/private/v2/dashboard/order`, order);
  }
}
