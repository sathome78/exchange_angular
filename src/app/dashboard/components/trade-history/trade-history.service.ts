import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {StompService} from '@stomp/ng2-stompjs';
import {map} from 'rxjs/internal/operators';
import {CurrencyPair} from '../../../model/currency-pair.model';
import {Message} from '@stomp/stompjs';

@Injectable()
export class TradeHistoryService {

  allTradesListener: Subject<TradeItem[]>;
  personalTradesListener: Subject<TradeItem[]>;

  private tradesStompSubscription: any;

  constructor(private stompService: StompService) {
    this.allTradesListener = new Subject<TradeItem[]>();
    this.personalTradesListener = new Subject<TradeItem[]>();
  }

  subscribeStompForTrades(pair: CurrencyPair) {
    this.tradesStompSubscription = this.stompService
      .subscribe('/app/trades/' + pair.currencyPairId)
        .subscribe((message) => {
          // console.log(JSON.parse(JSON.parse(message.body)));
          this.allTradesListener.next(JSON.parse(JSON.parse(message.body)).data);
        });





      // .pipe(map(message => {
      //   const wrapper: TradesWrapper = JSON.parse(message.body);
      //   console.log(wrapper);
      //   return wrapper;
      // }))
      // .subscribe(wrapper => {
      //   if (wrapper.ALL) {
      //     this.allTradesListener.next(wrapper.ALL);
      //   }
      //   if (wrapper.MY) {
      //     this.personalTradesListener.next(wrapper.MY);
      //   }
      // });
  }

  unsubscribeStompForTrades() {
    if (this.tradesStompSubscription) {
      this.tradesStompSubscription.unsubscribe();
    }
  }
}

export class TradesWrapper {

  public ALL: TradeItem[];
  public MY:  TradeItem[];

}

export class TradeItem {

  constructor(public acceptionTime: string,
              public amountBase: string,
              public dateAcceptionTime: string,
              public needRefresh: boolean,
              public operationType: string,
              public orderId: number,
              public page: number,
              public rate: string) { }

  static deepCopy(other: TradeItem): TradeItem {
    return new TradeItem( other.acceptionTime,
      other.amountBase,
      other.dateAcceptionTime,
      other.needRefresh,
      other.operationType,
      other.orderId,
      other.page,
      other.rate);
  }
}
