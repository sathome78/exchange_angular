import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { environment } from 'environments/environment';

@Injectable()
export class EmbeddedOrdersService {

  private baseUrl;
  private stompSubscription: any;
  personalOrderListener: Subject<boolean> = new Subject<boolean>();

  constructor(
    private http: HttpClient,
  ) {
    this.baseUrl = environment.apiUrl;
  }

  getOpenOrders(currencyPairId): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/private/v2/dashboard/orders/OPENED`,
                         { params: { currencyPairId, scope: 'ALL' } });
  }

  getHistory(currencyPairId, status: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/private/v2/dashboard/orders/${status}`,
                         { params: { currencyPairId, limit: '15', scope: 'ALL' } });
  }

  updateOrder(order): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/private/v2/dashboard/order`, order);
  }

  deleteOrder(order): Observable<any> {
    const params = {
      order_id: order.id,
      type: order.orderBaseType,
    };
    return this.http.post(`${this.baseUrl}/api/private/v2/dashboard/cancel`, {}, { params });
  }

  createOrder(order): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/private/v2/dashboard/order`, order);
  }

  unsubscribeStomp() {
    if (this.stompSubscription) {
      this.stompSubscription.unsubscribe();
    }
  }
}
