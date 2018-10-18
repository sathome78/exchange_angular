import {Component, OnDestroy, OnInit} from '@angular/core';

import {AbstractDashboardItems} from '../abstract-dashboard-items';
import {OrderBookService, OrderItem} from './order-book.service';
import {MarketService} from '../markets/market.service';
import {CurrencyPair} from '../markets/currency-pair.model';

@Component({
  selector: 'app-order-book',
  templateUrl: './order-book.component.html',
  styleUrls: ['./order-book.component.scss']
})
export class OrderBookComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  /** dashboard item name (field for base class)*/
  public itemName: string;

  orderItems: OrderItem [] = [];
  private orderItemsSubscription: any;
  activeCurrencyPair: CurrencyPair;
  currencySubscription: any;

  refreshedIds: number[] = [];

  constructor(private orderStatisticsService: OrderBookService,
              private marketService: MarketService) {
    super();
  }

  ngOnInit() {
    this.itemName = 'order-book';
    this.refreshedIds = [];
    this.currencySubscription = this.marketService.activeCurrencyListener
      .subscribe(pair => {
        console.log(pair)
        this.activeCurrencyPair = pair;
        this.orderStatisticsService.unsubscribeStompForSellOrders();
        this.orderStatisticsService.subscribeStompForSellOrders(pair);
        this.orderItems = [];
      });
    this.orderItemsSubscription = this.orderStatisticsService.sellOrdersListener
      .subscribe(items => {
        this.addOrUpdate(items);
        console.log(items);
      });
  }

  ngOnDestroy() {
    this.currencySubscription.unsubscribe();
    this.orderStatisticsService.unsubscribeStompForSellOrders();
    this.orderItemsSubscription.unsubscribe();
  }

  // to check which item was recently refreshed
  isRefreshed(id: number) {
    this.refreshedIds.forEach(item => {
      if (item === id) {
        return true;
      }
    });
    return false;
  }

  addOrUpdate(newItems: OrderItem[]) {
    if (this.orderItems.length === 0) {
      this.orderItems.push(...newItems);
      return;
    }
    newItems.forEach(newItem => {
      let found = false;
      this.orderItems.forEach(oldItem => {
        if (oldItem.id === newItem.id) {
          oldItem = OrderItem.deepCopy(newItem);
          found = true;
        }
      });
      if (!found) {
        this.orderItems.push(newItem);
      }
    });
  }

}
