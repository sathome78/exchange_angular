import {Component, OnInit} from '@angular/core';
import {AbstractDashboardItems} from '../abstract-dashboard-items';
import {TradeHistoryService, TradeItem} from './trade-history.service';
import {MarketService} from '../markets/market.service';
import {CurrencyPair} from '../markets/currency-pair.model';


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

  constructor(private tradeService: TradeHistoryService,
              private marketService: MarketService) {
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

}
