import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {StompService} from '@stomp/ng2-stompjs';
import {CurrencyPair} from '../markets/currency-pair.model';
import {catchError, map} from 'rxjs/internal/operators';
import {Message} from '@stomp/stompjs';

@Injectable()
export class OrderBookService {

  buyOrdersListener: Subject<OrderItem[]>;
  sellOrdersListener: Subject<OrderItem[]>;

  private buyOrdersSubscription: any;
  private sellOrdersSubscription: any;
  private buyOrdersSubscriptionDynamic: any;
  private sellOrdersSubscriptionDynamic: any;

  constructor(private stompService: StompService) {
    this.sellOrdersListener = new Subject<OrderItem[]>();
    this.buyOrdersListener = new Subject<OrderItem[]>();
  }

  subscribeStompForSellOrders(pair: CurrencyPair) {
    this.sellOrdersSubscription = this.stompService
      .subscribe('/app/trade_orders/' + pair.currencyPairId)
      .subscribe((data: Message) => {
        console.log(JSON.parse(data.body));
      },
        catchError(err => {
          console.log(err);
          return err;
        }));




      // .pipe(map(this.extractOrderItems))
      // .subscribe(items => {
      //   this.sellOrdersListener.next(items.filter(function (item) {
      //     return item.orderType === 'SELL';
      //   }));
      // });
  }

  subscribeStompForBuyOrders(pair: CurrencyPair) {
    this.buyOrdersSubscriptionDynamic = this.stompService
      .subscribe('/app/trade_orders/' + pair.currencyPairId)
      .subscribe((data: Message) => {
          console.log(JSON.parse(data.body));
        },
        catchError(err => {
          console.log(err);
          return err;
        }));

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
    items.push(...JSON.parse(JSON.parse(message.body)));
    return items;
  }

  // todo for private use
  subscribeStompForSellOrdersDynamic(pair: CurrencyPair) {
    this.buyOrdersSubscriptionDynamic = this.stompService
      .subscribe('/app/queue/trade_orders/f/' + pair.currencyPairId)
      .pipe(map(this.extractDynamicItems))
      .subscribe(items => {
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

export class OrderItem {

  constructor(public needRefresh: boolean,
              public page: number,
              public id: number,
              public userId: number,
              public orderType: string,
              public exrate: number,
              public amountBase: number,
              public amountConvert: number,
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
      other.ordersIds);
  }
}

