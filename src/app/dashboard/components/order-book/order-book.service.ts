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

  buyOrdersListener: Subject<OrderItem[]>;
  sellOrdersListener: Subject<OrderItem[]>;
  lastOrderListener$: Subject<OrderItem>;

  private buyOrdersSubscription: any;
  private sellOrdersSubscription: any;
  private buyOrdersSubscriptionDynamic: any;
  private sellOrdersSubscriptionDynamic: any;

  constructor(private stompService: StompService,
              private http: HttpClient) {
    this.sellOrdersListener = new Subject<OrderItem[]>();
    this.buyOrdersListener = new Subject<OrderItem[]>();
    this.lastOrderListener$ = new Subject<OrderItem>();
  }

  subscribeStompOrders(pair: CurrencyPair) {
    return this.stompService
      .subscribe('/app/trade_orders/' + pair.currencyPairId)
      .pipe(map((message: Message) => {
        // console.log(JSON.parse(JSON.parse(message.body)[0]));
        return JSON.parse(message.body);
      }))
      .pipe(map(orders => orders.map ? orders.map(order => order) : orders));
    /*.subscribe((orders: OrderItemsWrapper []) => {
      console.log(orders)
      this.processOrderItems(orders, 'SELL');
      return orders;
    });*/




      // .pipe(map(this.extractOrderItems))
      // .subscribe(items => {
      //   this.sellOrdersListener.next(items.filter(function (item) {
      //     return item.orderType === 'SELL';
      //   }));
      // });
  }

  processOrderItems(wrappers: OrderItemsWrapper[], mode: string) {
    console.log(wrappers);
    let wrapper: OrderItemsWrapper;
    wrappers.forEach(wr => {
        console.log(wr);
      if (wr['type'] === mode) {
        console.log(wr);
        wrapper = wr;
      }
    });
    // console.log(wrapper);
    // this.sellOrdersListener.next(wrapper.data);
    // console.log(wrapper.data);
  }

  // example at: https://api.myjson.com/bins/h0f3m
  getMinAndMaxDayOrders(currencyPairId: number): Observable<Map<String, OrderItem>> {
    const url = environment.apiUrl + '/info/public/v2/currencies/min-max/' + currencyPairId;
    return this.http.get<Map<String, OrderItem>>(url);
  }


  subscribeStompForBuyOrders(pair: CurrencyPair) {
    return this.stompService
      .subscribe('/app/trade_orders/' + 58)
      .pipe( map((message: Message) => {
        console.log(JSON.parse(message.body));
        return JSON.parse(message.body);
      }));
      /*.subscribe((orders: OrderItemsWrapper []) => {
        console.log(orders)
        this.processOrderItems(orders, 'SELL');
        return orders;
      });
      .subscribe((data: Message) => {
          console.log(JSON.parse(data.body));
        },
        catchError(err => {
          console.log(err);
          return err;
        }));*/

      // .pipe(map(this.extractOrderItems))
      // .subscribe(items => {
      //   this.sellOrdersListener.next(items.filter(function (item) {
      //     return item.orderType === 'BUY';
      //   }));
      // });
  }

  private extractOrderItems(message: Message): OrderItem [] {
    const items: OrderItem [] = [];
    console.log(items);
    items.push(...JSON.parse(message.body));
    return items;
  }

  // todo for private use
  subscribeStompForSellOrdersDynamic(pair: CurrencyPair) {
    this.buyOrdersSubscriptionDynamic = this.stompService
      .subscribe('/app/queue/trade_orders/f/' + pair.currencyPairId)
      .pipe(map(this.extractDynamicItems))
      .subscribe(items => {
         console.log('dinamics: SELL');
         console.log(items);
        this.buyOrdersListener.next(items.filter(function (item) {
          return item.orderType === 'SELL';
        }));
      });
  }

  // todo for private use
  subscribeStompForBuyOrdersDynamic(pair: CurrencyPair) {
    this.buyOrdersSubscription = this.stompService
      .subscribe('/app/queue/trade_orders/f/' + pair.currencyPairId)
      .pipe(map(this.extractDynamicItems))
      .subscribe(items => {
        console.log('dinamics: SELL');
        console.log(items);
        this.buyOrdersListener.next(items.filter(function (item) {
          return item.orderType === 'BUY';
        }));
      });
  }

  private extractDynamicItems(message: Message): any [] {
    // const items: OrderItem [] = [];
    // items.push(...JSON.parse(message.body));
    console.log(JSON.parse(message.body));
    return JSON.parse(message.body);
  }

  unsubscribeStompForBuyOrders() {
    if (this.buyOrdersSubscription) {
      this.buyOrdersSubscription.unsubscribe();
    }
    if (this.buyOrdersSubscriptionDynamic) {
      this.buyOrdersSubscriptionDynamic.unsubscribe();
    }
  }

  unsubscribeStompForSellOrders() {
    if (this.sellOrdersSubscription) {
      this.sellOrdersSubscription.unsubscribe();
    }
    if (this.sellOrdersSubscriptionDynamic) {
      this.sellOrdersSubscriptionDynamic.unsubscribe();
    }
  }
}

export class OrderItemsWrapper {

  constructor(public data: OrderItem[],
              public type: string,
              public currencyPairId: number) {}
}



