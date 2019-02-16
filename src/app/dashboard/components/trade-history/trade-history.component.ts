import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';

import {AbstractDashboardItems} from '../../abstract-dashboard-items';
import {TradeHistoryService} from './trade-history.service';
import {MarketService} from '../markets/market.service';
import {CurrencyPair} from '../../../model/currency-pair.model';
import {select, Store} from '@ngrx/store';
import {State, getActiveCurrencyPair, getAllTrades, getLoadingAllTrades} from 'app/core/reducers/index';
import {TradeItem} from '../../../model/trade-item.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DashboardWebSocketService} from 'app/dashboard/dashboard-websocket.service';


@Component({
  selector: 'app-trade-history',
  templateUrl: 'trade-history.component.html',
  styleUrls: ['trade-history.component.scss']
})
export class TradeHistoryComponent extends AbstractDashboardItems implements OnInit {
  /** dashboard item name (field for base class)*/
  public itemName: string;

  allTrades: TradeItem [] = [];
  personalTrades: TradeItem [] = [];

  activeCurrencyPair: CurrencyPair;
  currencySubscription: any;

  allTradesSubscription: any;
  personalTradesSubscription: any;

  secondCurrency;
  firstCurrency;
  public loading$: Observable<boolean>;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  userInSystem: boolean;

  constructor(
    private store: Store<State>,
    private tradeService: TradeHistoryService,
    private dashboardWebsocketService: DashboardWebSocketService,
) {
  super();
  }


  ngOnInit() {
    this.itemName = 'trade-history';
    // todo move ro store
    this.tradeService
      .getFirstTrades(1)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(items => this.allTrades = items);

    this.dashboardWebsocketService.setRabbitStompSubscription()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair) => {
        this.tradeService
          .getFirstTrades(pair.currencyPairId)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(items => this.allTrades = items);
      })

    this.store
    .pipe(select(getActiveCurrencyPair))
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((pair: CurrencyPair) => {
      if (pair.currencyPairId) {
        this.onGetCurrentCurrencyPair(pair);
      }
      });

    this.store
      .pipe(select(getAllTrades))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(orders => {
        this.addOrUpdate(this.allTrades, orders);
        /** sort items */
        this.allTrades.sort((a, b) => {
          let timeA, timeB;
          timeA = parseInt(a.acceptionTime, 10);
          timeB = parseInt(b.acceptionTime, 10);
          return timeB - timeA;
        });
      });

    this.loading$ = this.store
      .pipe(select(getLoadingAllTrades))
      .pipe(takeUntil(this.ngUnsubscribe))

    // this.allTradesSubscription = this.tradeService.allTradesListener
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe(orders => {
    //     this.addOrUpdate(this.allTrades, orders);
    //     /** sort items */
    //     this.allTrades.sort((a, b) => {
    //       let timeA, timeB;
    //       timeA = parseInt(a.acceptionTime, 10);
    //       timeB = parseInt(b.acceptionTime, 10);
    //
    //       return timeA - timeB;
    //     });
    //
    //     // TODO: remove after dashboard init load time issue is solved
    //     // this.ref.detectChanges();
    //   });
  }

  addOrUpdate(oldItems: TradeItem[], newItems: TradeItem[]) {
    if (oldItems.length === 0) {
      oldItems.push(...newItems);
      return;
    }
    newItems.forEach(newItem => {
      let found = false;
      oldItems.forEach(oldItem => {
        if (oldItem.orderId === newItem.orderId) {
          oldItem = TradeItem.deepCopy(newItem);
          found = true;
        }
      });
      if (!found) {
        oldItems.push(newItem);
      }
    });
  }

  formattingCurrentPairName(currentPair: string): void {
    /** search slash position */
    if (currentPair) {
      let index: number;
      index = currentPair.match(/\+|-|\/|\*/).index;

      this.firstCurrency = currentPair.slice(0, index);
      this.secondCurrency = currentPair.slice(index + 1);
    }
  }

  private onGetCurrentCurrencyPair(pair) {
    this.activeCurrencyPair = pair;
    this.tradeService.subscribeStompForTrades(pair);
    this.allTrades = [];
    this.personalTrades = [];
    this.formattingCurrentPairName(pair.currencyPairName as string);
  }

}
