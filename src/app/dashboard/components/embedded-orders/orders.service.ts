import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {map} from 'rxjs/internal/operators';
import {Observable, Subject} from 'rxjs';

import {environment} from 'environments/environment';

@Injectable()
export class OrdersService {

  private baseUrl;
  private stompSubscription: any;
  personalOrderListener: Subject<boolean> = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private stompService: StompService
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

  setFreshOpenOrdersSubscription(currencyPairId: number, precision?: number = 1) {
    this.stompSubscription = this.stompService
      .subscribe(`/topic/open-orders/${currencyPairId}/${precision}`)
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .subscribe(orders => this.personalOrderListener.next(orders));
  }

  unsubscribeStomp() {
    this.stompSubscription.unsubscribe();
  }
}
