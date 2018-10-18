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

  sellOrders: OrderItem [] = [];
  buyOrders: OrderItem [] = [];
  private buyOrdersSubscription: any;
  private sellOrdersSubscription: any;
  activeCurrencyPair: CurrencyPair;
  currencySubscription: any;

  refreshedIds: number[] = [];

  constructor(private orderBookService: OrderBookService,
              private marketService: MarketService) {
    super();
  }

  ngOnInit() {
    this.itemName = 'order-book';
    this.refreshedIds = [];
    this.currencySubscription = this.marketService.activeCurrencyListener
      .subscribe(pair => {
        console.log(pair);
        this.activeCurrencyPair = pair;
        this.updateSubscription(pair);
        this.sellOrders = [];
        this.buyOrders = [];
      });
    this.buyOrdersSubscription = this.orderBookService.sellOrdersListener
      .subscribe(items => {
        this.addOrUpdate(this.sellOrders, items);
        console.log(items);
      });
    this.buyOrdersSubscription = this.orderBookService.sellOrdersListener
      .subscribe(items => {
        this.addOrUpdate(this.sellOrders, items);
        console.log(items);
      });
    this.sellOrdersSubscription = this.orderBookService.buyOrdersListener
      .subscribe(items => {
        this.addOrUpdate(this.buyOrders, items);
        console.log(items);
      });
  }

  ngOnDestroy() {
    this.currencySubscription.unsubscribe();
    this.orderBookService.unsubscribeStompForSellOrders();
    this.orderBookService.unsubscribeStompForBuyOrders();
    this.buyOrdersSubscription.unsubscribe();
    this.sellOrdersSubscription.unsubscribe();
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

  /**
   * When currency pair is updated we need to load orders for new pair
   * @param {CurrencyPair} pair - active pair
   */
  updateSubscription(pair: CurrencyPair) {
    this.orderBookService.unsubscribeStompForSellOrders();
    this.orderBookService.unsubscribeStompForBuyOrders();
    this.orderBookService.subscribeStompForSellOrders(pair);
    this.orderBookService.subscribeStompForBuyOrders(pair);
  }

  addOrUpdate(orders: OrderItem[], newItems: OrderItem[]) {
    if (orders.length === 0) {
      orders.push(...newItems);
      return;
    }
    newItems.forEach(newItem => {
      let found = false;
      orders.forEach(oldItem => {
        if (oldItem.id === newItem.id) {
          oldItem = OrderItem.deepCopy(newItem);
          found = true;
        }
      });
      if (!found) {
        orders.push(newItem);
      }
    });
  }

}
