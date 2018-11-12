import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { takeUntil } from 'rxjs/internal/operators';
import { Subject } from 'rxjs/Subject';

import { AbstractDashboardItems } from '../abstract-dashboard-items';
import { TradeHistoryService, TradeItem } from './trade-history.service';
import { MarketService } from '../markets/market.service';
import { CurrencyPair } from '../markets/currency-pair.model';
import { PARENT } from '@angular/core/src/render3/interfaces/view';


@Component({
  selector: 'app-trade-history',
  templateUrl: './trade-history.component.html',
  styleUrls: ['./trade-history.component.scss']
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

  constructor(private tradeService: TradeHistoryService,
              private marketService: MarketService,
              private ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.itemName = 'trade-history';
    this.currencySubscription = this.marketService.activeCurrencyListener
      .subscribe(pair => {
        this.activeCurrencyPair = pair;
        this.tradeService.subscribeStompForTrades(pair);
        this.allTrades = [];
        this.personalTrades = [];
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

    /** getting current currency pair */
    this.marketService.activeCurrencyListener.pipe(takeUntil(this.ngUnsubscribe)).subscribe(pair => {
      this.formattingCurrentPairName(pair.currencyPairName as string);
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
    let index: number;
    index = currentPair.match(/\+|-|\/|\*/).index;

    this.firstCurrency = currentPair.slice(0, index);
    this.secondCurrency = currentPair.slice(index + 1);
  }
}
