import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {StompService} from '@stomp/ng2-stompjs';
import {map} from 'rxjs/internal/operators';
import {CurrencyPair} from '../../../model/currency-pair.model';
import {Message} from '@stomp/stompjs';
import {TradeItem} from '../../../model/trade-item.model';
import {Store} from '@ngrx/store';
import {State} from '../../reducers/dashboard.reducer';
import {SetAllTradesAction, SetLastSellBuyOrderAction} from '../../actions/dashboard.actions';
import {LastSellBuyOrder} from '../../../model/last-sell-buy-order.model';
import {defaultLastSellBuyOrder} from '../../reducers/default-values';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable()
export class TradeHistoryService {

  // allTradesListener: Subject<TradeItem[]>;
  personalTradesListener: Subject<TradeItem[]>;

  private tradesStompSubscription: any;
  public lastSellBuyOrders: LastSellBuyOrder;

  constructor(
    private stompService: StompService,
    private store: Store<State>,
    private http: HttpClient,
  ) {
    // this.allTradesListener = new Subject<TradeItem[]>();
    this.personalTradesListener = new Subject<TradeItem[]>();
    this.lastSellBuyOrders = defaultLastSellBuyOrder;
  }

  subscribeStompForTrades(pair: CurrencyPair) {
    this.tradesStompSubscription = this.stompService
      .subscribe('/app/trades/' + pair.currencyPairId)
        .subscribe((message) => {
          // console.log(JSON.parse(JSON.parse(message.body)));
          // console.log('kdj')
          this.setLastBuyOrder(JSON.parse(JSON.parse(message.body)).data);
          this.setLastSellOrder(JSON.parse(JSON.parse(message.body)).data);
          this.store.dispatch(new SetAllTradesAction(JSON.parse(JSON.parse(message.body)).data));

          // this.allTradesListener.next(JSON.parse(JSON.parse(message.body)).data);
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

  public getFirstTrades(currencyPairId?: number): Observable<TradeItem[]> {
    const params = {
      pairId: currencyPairId + '' || '1',
    }
    return this.http.get<TradeItem[]>(environment.apiUrl + '/info/public/v2/accepted-orders/fast', {params})
  }

  unsubscribeStompForTrades() {
    if (this.tradesStompSubscription) {
      this.tradesStompSubscription.unsubscribe();
    }
  }

  /**
   * Set last buy order and set field
   * @param orders
   */
  setLastBuyOrder(orders) {
    if (orders.length) {
      const filteredBuyOrders = orders.filter(order => order.operationType === 'BUY')
      const tempData = this.sortOrders(filteredBuyOrders);
      if (tempData.length) {
        this.lastSellBuyOrders.lastBuyOrder = tempData[tempData.length - 1];
        this.nextLastSellBuyOrders();
      }
    }
  }

  /**
   * Set last sell order and set field
   * @param orders
   */
  setLastSellOrder(orders) {
    if (orders.length) {
      const filteredSellOrders = orders.filter(order => order.operationType === 'SELL')
      const tempData = this.sortOrders(filteredSellOrders);
      if (tempData.length) {
        this.lastSellBuyOrders.lastSellOrder = tempData[tempData.length - 1];
        this.nextLastSellBuyOrders();
      }
    }
  }

  /**
   * Set last Sell/Buy orders in store
   */
  nextLastSellBuyOrders() {
    const tempArray = this.sortOrders([this.lastSellBuyOrders.lastBuyOrder, this.lastSellBuyOrders.lastSellOrder])
    this.lastSellBuyOrders.lastOrder = tempArray[tempArray.length - 1];
    this.store.dispatch(new SetLastSellBuyOrderAction(this.lastSellBuyOrders));
  }

  /**
   * Sort orders by date
   * @param orders
   * @returns {OrderItem[]}
   */
  sortOrders(orders): TradeItem[] {
    if (orders) {
      const tempData = orders.sort((a, b) => {
        // const dateA = new Date(a.created).getTime();
        // const dateB = new Date(b.created).getTime();
        const dateA = a.acceptionTime;
        const dateB = b.acceptionTime;
        return dateA - dateB;
      });
      return tempData;
    } else {
      return [];
    }
  }
}

export class TradesWrapper {

  public ALL: TradeItem[];
  public MY:  TradeItem[];

}

