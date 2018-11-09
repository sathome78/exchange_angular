import {Component, OnDestroy, OnInit, ElementRef, ViewChild} from '@angular/core';

import {AbstractDashboardItems} from '../abstract-dashboard-items';
import {OrderBookService, OrderItem} from './order-book.service';
import {MarketService} from '../markets/market.service';
import {DashboardDataService} from '../dashboard-data.service';
import {TradingService} from '../trading/trading.service';
import {CurrencyPair} from '../markets/currency-pair.model';
import { setHostBindings } from '@angular/core/src/render3/instructions';
import { forEach } from '@angular/router/src/utils/collection';
import { ChildActivationStart } from '@angular/router';
import {map} from 'rxjs/internal/operators';

@Component({
  selector: 'app-order-book',
  templateUrl: './order-book.component.html',
  styleUrls: ['./order-book.component.scss']
})
export class OrderBookComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  /** dashboard item name (field for base class)*/
  public itemName: string;
  public lastOrder;
  public lastOrderUp = true;
  public currencyPairInfo;


  @ViewChild('orderBook')
  orderbookConainer: ElementRef;

  public dataForSell: OrderItem [];
  public dataBurBuy: OrderItem [];

  // public dataForSell: OrderItem [];
  // public dataBurBuy: OrderItem [];
  public isBuy: boolean;

  public maxExrate: string;
  public minExrate: string;

  /** maximum value from the array 'dataForVisualization'*/
  private maxSell: number;
  private maxBuy: number;

  /** height for orderbook item */
  private elementHeight: number;
  private elementHeightMobile: number;

  /** data array for data visualization for order book  */
  private dataForVisualizationSellOrders: [number];
  private dataForVisualizationBuyOrders: [number];

  private sellOrders: OrderItem [] = [];
  private buyOrders: OrderItem [] = [];

  private buyOrdersSubscription: any;
  private sellOrdersSubscription: any;
  activeCurrencyPair: CurrencyPair;
  currencySubscription: any;
  orderTypeClass: string;

  refreshedIds: number[] = [];


  constructor(private orderBookService: OrderBookService,
              private marketService: MarketService,
              private dashboardDataService: DashboardDataService,
              private tradingService: TradingService) {
    super();
  }

  ngOnInit() {
    this.itemName = 'order-book';
    this.orderTypeClass = 'order-table--buy';

    this.elementHeight = 200;
    this.elementHeightMobile = 400;

    /** create test mock data */
    this.maxExrate = '0';
    this.minExrate = '0';

    this.isBuy = true;

    this.marketService.currentCurrencyInfoListener$.subscribe(res => {
      this.currencyPairInfo = res;
      if (!this.lastOrder) {
        this.lastOrder = {};
        this.lastOrder.exrate = this.currencyPairInfo.volume24h;
        this.lastOrder.amountBase = this.currencyPairInfo.lastCurrencyRate;
      }
    })

    this.tradingService.tradingChangeSellBuy$.subscribe((data) => {
      if (data === 'SELL') {
        this.isBuy = false;
        this.orderTypeClass = 'order-teble--sell';
      } else if (data === 'BUY') {
        this.isBuy = true;
        this.orderTypeClass = 'order-table--buy';
      }

      this.setData();
    });

    this.setData();

    this.refreshedIds = [];
    this.currencySubscription = this.marketService.activeCurrencyListener
      .subscribe(pair => {
        // console.log(pair);
        this.activeCurrencyPair = pair;
        this.updateSubscription(pair);
        this.loadMinAndMaxValues(pair);
        // this.sellOrders = [];
        // this.buyOrders = [];
      });
    this.buyOrdersSubscription = this.orderBookService.sellOrdersListener
      .subscribe(items => {
        if (items.length >= 1) {
          this.addOrUpdate(this.sellOrders, items);
        }
        console.log(items);
      });
    this.sellOrdersSubscription = this.orderBookService.buyOrdersListener
      .subscribe(items => {
        if (items.length >= 1) {
          this.addOrUpdate(this.buyOrders, items);
        }
        console.log(items);
      });
  }

  loadMinAndMaxValues(pair: CurrencyPair) {
    /**
     * this method returns min and max rate for active currency pair
     * see example in service implementation
     */
    this.orderBookService.getMinAndMaxDayOrders(this.activeCurrencyPair.currencyPairId);
      // .subscribe(res => {
      //     // console.log(res);
      //     this.maxExrate =  res['MAX'];
      //     this.minExrate = res['MIN'];
      //   },
      //   error1 => {
      //     console.log(error1);
      //   });
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
    this.orderBookService.subscribeStompOrders(pair)
      .pipe(map(orders => orders.filter ? orders.filter(order => order.type === 'SELL') : orders.type === 'SELL'))
      .pipe(map(orders => orders[0] ? orders[0].data : orders.data))
      .subscribe(orders => {
        this.sellOrders = orders;
        this.getLastOrder(orders);
      });
    this.orderBookService.subscribeStompOrders(pair)
      .pipe(map(orders => orders.filter ? orders.filter(order => order.type === 'BUY') : orders.type === 'BUY'))
      .pipe(map(orders => orders[0] ? orders[0].data : orders.data))
      .subscribe(orders => {
        this.buyOrders = orders;
        this.getLastOrder(orders);
        this.setData();
      });
  }

  addOrUpdate(orders: OrderItem[], newItems: OrderItem[]) {
    if (orders.length === 0) {
      orders.push(...newItems);
      this.getLastOrder(newItems);
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
    this.getLastOrder(newItems);
  }

  getLastOrder(orders) {
    const tempData = orders.sort((a, b) => {
      const dateA = new Date(a.created).getTime();
      const dateB = new Date(b.created).getTime();
      return dateA - dateB;
    });
    if (this.lastOrder) {
      this.lastOrderUp = tempData[tempData.length - 1].exrate > this.lastOrder.exrate;
    }
    this.lastOrder = {...tempData[tempData.length - 1]};
  }

  private sortBuyData(): void {
    if (!this.buyOrders) {
      return;
    }
    this.buyOrders.sort((a, b) => a.exrate - b.exrate);
  }

  private sortSellData(): void {
    if (!this.sellOrders) {
      return;
    }
    this.sellOrders.sort((a, b) => b.exrate - a.exrate);

  }

  private getBestitems(isBuy: boolean, count: number = 9) {
    this.dataBurBuy = this.buyOrders.slice(0, count);
    this.dataForSell = this.sellOrders.slice(0, count);

    this.setDataForVisualization();
  }

  private getPercentageOfTheNumber(number: number, isBuy: boolean): string {
    const coefficient = isBuy ?  (this.maxBuy / number) : (this.maxSell / number);
    return ((60 / coefficient) + '%');
  }

  private getMaxDataOfArray(array: [number]): number {
    return Math.max.apply(null, array);
  }

  private onSelectOrder(orderIndex, item: OrderItem, widgetName: string): void {
    // const index = (parseInt(orderIndex + 1, 10) - 1);
    // if (this.isBuy) {
    //   this.sortBuyData();
    //   this.data = this.buyOrders.slice(index, 20);
    //   this.setDataForVisualization();
    // } else {
    //   this.sortSellData();
    //   this.data = this.sellOrders.slice(index, 20);
    //   this.setDataForVisualization();
    // }

    /** sends the data in to trading */
    this.dashboardDataService.selectedOrderTrading$.next(item);
    this.dashboardDataService.activeMobileWidget.next(widgetName);
  }

  private setDataForVisualization(): void {
    this.dataForVisualizationBuyOrders = [null];
    this.dataForVisualizationSellOrders = [null];
    this.maxBuy = 0;
    this.maxSell = 0;

    /** Buy */
    this.dataBurBuy.forEach((element, index) => {
      this.dataForVisualizationBuyOrders.push(element.exrate);
    });

    this.maxBuy = this.getMaxDataOfArray(this.dataForVisualizationBuyOrders);

    /** Sell */
    this.dataForSell.forEach((element, index) => {
      this.dataForVisualizationSellOrders.push(element.exrate);
    });

    // this.dataForVisualization = [null];
    // this.data.forEach((element, index) => {
    //   console.log(element);
    //   this.dataForVisualization.push(element.exrate);
    // });
    this.maxSell = this.getMaxDataOfArray(this.dataForVisualizationSellOrders);
  }

  private setData(): void {
    this.sortBuyData();
    this.getBestitems(true);

    this.sortSellData();
    this.getBestitems(false);
  }
}
