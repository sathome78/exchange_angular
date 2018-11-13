import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {StompService} from '@stomp/ng2-stompjs';
import {CurrencyPair} from '../markets/currency-pair.model';
import {catchError, map} from 'rxjs/internal/operators';
import {Message} from '@stomp/stompjs';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

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
        // console.log(JSON.parse(message.body));
        return JSON.parse(message.body);
      }))
      .pipe(map(orders => orders.map ? orders.map(order => JSON.parse(order)) : orders));
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

export class OrderItem {

  constructor(public needRefresh: boolean,
              public page: number,
              public id: number,
              public userId: number,
              public orderType: string,
              public exrate: number,
              public amountBase: number,
              public amountConvert: number,
              public created: Date,
              public accepted: Date,
              public ordersIds: string) { }

  static deepCopy(other: OrderItem) {
    return new OrderItem( other.needRefresh,
      other.page,
      other.id,
      other.userId,
      other.orderType,
      other.exrate,
      other.amountBase,
      other.amountConvert,
      other.created,
      other.accepted,
      other.ordersIds);
  }
}

