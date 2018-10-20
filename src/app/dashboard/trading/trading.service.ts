import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Order} from './order.model';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class TradingService {

  /** emit on change tabs sell/buy in trading-component */
  public tradingChangeSellBuy$ = new Subject();
  /** emit order when created in trading-component */
  public tradingCreateOrder$ = new Subject();

  constructor(
    private http: HttpClient
  ) {}

  createOrder(order: Order) {
     return this.http.post(`/info/private/v2/dashboard/order`, order );
  }

  updateOrder(order: Order) {
    return this.http.put(`/info/private/v2/dashboard/order`, order);
  }

  deleteOrder(orderId: number) {
    return this.http.delete(`/info/private/v2/dashboard/order/${orderId}`);
  }
}
