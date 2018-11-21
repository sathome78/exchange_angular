import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {catchError, map} from 'rxjs/internal/operators';
import {Subject, Observable} from 'rxjs';

import {environment} from 'environments/environment';
import {CurrencyPair} from '../../../model/currency-pair.model';
import {OrderItem} from '../../../model/order-item.model';

@Injectable()
export class OrderBookService {

  lastOrderListener$: Subject<OrderItem>;

  constructor(private stompService: StompService, private http: HttpClient) {
    this.lastOrderListener$ = new Subject<OrderItem>();
  }

  // /info/public/v2/open-orders/{pairId}/{precision}
  subscribeStompOrders(pair: CurrencyPair, precision: number) {
    return this.stompService
      .subscribe(`/app/open_orders/${pair.currencyPairId}/${precision}`)
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .pipe(map(orders => orders.map ? orders.map(order => order) : orders));
  }

  // example at: https://api.myjson.com/bins/h0f3m
  getMinAndMaxDayOrders(currencyPairId: number): Observable<Map<String, OrderItem>> {
    const url = environment.apiUrl + '/info/public/v2/currencies/min-max/' + currencyPairId;
    return this.http.get<Map<String, OrderItem>>(url);
  }
}

export class OrderItemsWrapper {

  constructor(public data: OrderItem[],
              public type: string,
              public currencyPairId: number) {}
}



