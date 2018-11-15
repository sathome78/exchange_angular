import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { takeUntil } from 'rxjs/internal/operators';
import { Subject } from 'rxjs/Subject';

import { AbstractDashboardItems } from '../../abstract-dashboard-items';
import { TradeHistoryService, TradeItem } from './trade-history.service';
import { MarketService } from '../markets/market.service';
import { CurrencyPair } from '../../../model/currency-pair.model';
import {select, Store} from '@ngrx/store';
import {State, getCurrencyPair} from 'app/core/reducers/index';


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

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  userInSystem: boolean;
  private mockData: TradeItem [];
  private data;

  constructor(
    private store: Store<State>,
    private tradeService: TradeHistoryService,
    private marketService: MarketService,
    private ref: ChangeDetectorRef) {
    super();
  }



  ngOnInit() {
    this.itemName = 'trade-history';
    this.store
      .pipe(select(getCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (pair: CurrencyPair) => {
        this.onGetCurrentCurrencyPair(pair);
      });

    this.allTradesSubscription = this.tradeService.allTradesListener
      .subscribe(orders => {
        this.addOrUpdate(this.allTrades, orders);
        /** sort items */
        this.allTrades.sort((a, b) => {
          let timeA, timeB;
          timeA = parseInt(a.acceptionTime, 10);
          timeB = parseInt(b.acceptionTime, 10);

          return timeA - timeB;
        });

        // TODO: remove after dashboard init load time issue is solved
        // this.ref.detectChanges();
      });
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
