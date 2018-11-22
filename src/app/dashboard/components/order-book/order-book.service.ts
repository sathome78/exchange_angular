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
  // http://dev5.exrates.tech/info/public/v2/open-orders/1/5

  // /info/public/v2/open-orders/{pairId}/{precision}
  subscribeStompOrders(pair: CurrencyPair, precision: number) {
    console.log('tt')
    return this.stompService
      .subscribe(`/app/open_orders/${pair.currencyPairId}/${precision}`)
      .pipe(map(res => {
        console.log(res);
        return res;
      }))
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .pipe(map(orders => orders.map ? orders.map(order => order) : orders));
  }

  // example at: https://api.myjson.com/bins/h0f3m
  getMinAndMaxDayOrders(currencyPairId: number): Observable<Map<String, OrderItem>> {
    const url = environment.apiUrl + '/info/public/v2/currencies/min-max/' + currencyPairId;
    return this.http.get<Map<String, OrderItem>>(url);
  }

  getOrderbookDateOnInit(pair: CurrencyPair,  precision: number) {
    const url = `${environment.apiUrl}/info/public/v2/open-orders/${pair.currencyPairId}/${precision}`;
    return this.http.get(url);
  }
}


export class OrderItemsWrapper {

  constructor(public data: OrderItem[],
              public type: string,
              public currencyPairId: number) {}
}



