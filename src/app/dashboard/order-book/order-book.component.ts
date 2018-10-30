import {Component, OnDestroy, OnInit, ElementRef, ViewChild, ChangeDetectorRef} from '@angular/core';

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

  @ViewChild('orderBook')
  orderbookConainer: ElementRef;

  /** test json data */
  private buyJson: object = {
    'data': [
      {
        'needRefresh': true,
        'page': 0,
        'id': 12,
        'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.00290479',
        'amountBase': '241.753653444',
        'amountConvert': '0.001158000',
        'ordersIds': '9788753 9789264'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0, 'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.006005',
        'amountBase': '307.313187848',
        'amountConvert': '0.001536566',
        'ordersIds': '9788748 9789259'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0, 'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.006005557',
        'amountBase': '3182.000000000',
        'amountConvert': '0.017682374',
        'ordersIds': '9788456 9788967'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0,
        'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.00806979',
        'amountBase': '0.000200000',
        'amountConvert': '0.000000014',
        'ordersIds': '9788589 9789100'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0, 'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.03148956',
        'amountBase': '0.005403912',
        'amountConvert': '0.000170166',
        'ordersIds': '9788788 9789299'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0, 'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.03148961',
        'amountBase': '0.005579976',
        'amountConvert': '0.000175712',
        'ordersIds': '9788771 9789282'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0, 'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.03000479',
        'amountBase': '241.753653444',
        'amountConvert': '0.001158000',
        'ordersIds': '9788753 9789264'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0,
        'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.002005',
        'amountBase': '307.313187848',
        'amountConvert': '0.001536566',
        'ordersIds': '9788748 9789259'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0, 'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.0170005557',
        'amountBase': '3182.000000000',
        'amountConvert': '0.017682374',
        'ordersIds': '9788456 9788967'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0, 'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.016006979',
        'amountBase': '0.000200000',
        'amountConvert': '0.000000014',
        'ordersIds': '9788589 9789100'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0, 'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.03148956',
        'amountBase': '0.005403912',
        'amountConvert': '0.000170166',
        'ordersIds': '9788788 9789299'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0, 'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.03148961',
        'amountBase': '0.005579976',
        'amountConvert': '0.000175712',
        'ordersIds': '9788771 9789282'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0, 'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.009900479',
        'amountBase': '241.753653444',
        'amountConvert': '0.001158000',
        'ordersIds': '9788753 9789264'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0, 'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.002005',
        'amountBase': '307.313187848',
        'amountConvert': '0.001536566',
        'ordersIds': '9788748 9789259'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0, 'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.018005557',
        'amountBase': '3182.000000000',
        'amountConvert': '0.017682374',
        'ordersIds': '9788456 9788967'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0, 'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.00006979',
        'amountBase': '0.009200000',
        'amountConvert': '0.000000014',
        'ordersIds': '9788589 9789100'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0, 'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.02948956',
        'amountBase': '0.005403912',
        'amountConvert': '0.000170166',
        'ordersIds': '9788788 9789299'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0, 'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.02948956',
        'amountBase': '0.005403912',
        'amountConvert': '0.000170166',
        'ordersIds': '9788788 9789299'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0, 'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.02948956',
        'amountBase': '0.005403912',
        'amountConvert': '0.000170166',
        'ordersIds': '9788788 9789299'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0, 'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.02948956',
        'amountBase': '0.005403912',
        'amountConvert': '0.000170166',
        'ordersIds': '9788788 9789299'
      },
      {
        'needRefresh': true,
        'page': 0, 'id': 0, 'userId': 0,
        'orderType': 'BUY',
        'exrate': '0.02148961',
        'amountBase': '0.005579976',
        'amountConvert': '0.000175712',
        'ordersIds': '9788771 9789282'
      }], 'type': 'BUY', 'currencyPairId': 1
  };

  private sellJson: object = {
    'data': [
      {
        'needRefresh': true,
        'page': 0,
        'id': 0,
        'userId': 0,
        'orderType': 'SELL',
        'exrate': '0.00050479',
        'amountBase': '241.753653444',
        'amountConvert': '0.001158000',
        'ordersIds': '9788753 9789264'
      },
      {
        'needRefresh': true,
        'page': 0,
        'id': 0,
        'userId': 0,
        'orderType': 'SELL',
        'exrate': '0.005005',
        'amountBase': '307.313187848',
        'amountConvert': '0.001536566',
        'ordersIds': '9788748 9789259'
      },
      {
        'needRefresh': true,
        'page': 0,
        'id': 0,
        'userId': 0,
        'orderType': 'SELL',
        'exrate': '0.005405557',
        'amountBase': '3182.000000000',
        'amountConvert': '0.017682374',
        'ordersIds': '9788456 9788967'
      },
      {
        'needRefresh': true,
        'page': 0,
        'id': 0,
        'userId': 0,
        'orderType': 'SELL',
        'exrate': '0.02006979',
        'amountBase': '0.000200000',
        'amountConvert': '0.000000014',
        'ordersIds': '9788589 9789100'
      },
      {
        'needRefresh': true,
        'page': 0,
        'id': 0,
        'userId': 0,
        'orderType': 'SELL',
        'exrate': '0.03148956',
        'amountBase': '0.005403912',
        'amountConvert': '0.000170166',
        'ordersIds': '9788788 9789299'
      },
      {
        'needRefresh': true,
        'page': 0,
        'id': 0,
        'userId': 0,
        'orderType': 'SELL',
        'exrate': '0.03148961',
        'amountBase': '0.005579976',
        'amountConvert': '0.000175712',
        'ordersIds': '9788771 9789282'
      },
      {
        'needRefresh': true,
        'page': 0,
        'id': 0,
        'userId': 0,
        'orderType': 'SELL',
        'exrate': '0.01000479',
        'amountBase': '241.753653444',
        'amountConvert': '0.001158000',
        'ordersIds': '9788753 9789264'
      },
      {
        'needRefresh': true,
        'page': 0,
        'id': 0,
        'userId': 0,
        'orderType': 'SELL',
        'exrate': '0.009005',
        'amountBase': '307.313187848',
        'amountConvert': '0.001536566',
        'ordersIds': '9788748 9789259'
      },
      {
        'needRefresh': true,
        'page': 0,
        'id': 0,
        'userId': 0,
        'orderType': 'SELL',
        'exrate': '0.020005557',
        'amountBase': '3182.000000000',
        'amountConvert': '0.017682374',
        'ordersIds': '9788456 9788967'
      },
      {
        'needRefresh': true,
        'page': 0,
        'id': 0,
        'userId': 0,
        'orderType': 'SELL',
        'exrate': '0.01956979',
        'amountBase': '0.000200000',
        'amountConvert': '0.000000014',
        'ordersIds': '9788589 9789100'
      },
      {
        'needRefresh': true,
        'page': 0,
        'id': 0,
        'userId': 0,
        'orderType': 'SELL',
        'exrate': '0.03048956',
        'amountBase': '0.005403912',
        'amountConvert': '0.000170166',
        'ordersIds': '9788788 9789299'
      },
      {
        'needRefresh': true,
        'page': 0,
        'id': 0,
        'userId': 0,
        'orderType': 'SELL',
        'exrate': '0.03148961',
        'amountBase': '0.005579976',
        'amountConvert': '0.000175712',
        'ordersIds': '9788771 9789282'
      },
      {
        'needRefresh': true,
        'page': 0,
        'id': 0,
        'userId': 0,
        'orderType': 'SELL',
        'exrate': '0.00200479',
        'amountBase': '241.753653444',
        'amountConvert': '0.001158000',
        'ordersIds': '9788753 9789264'
      },
      {
        'needRefresh': true,
        'page': 0,
        'id': 0,
        'userId': 0,
        'orderType': 'SELL',
        'exrate': '0.000005',
        'amountBase': '307.313187848',
        'amountConvert': '0.001536566',
        'ordersIds': '9788748 9789259'
      },
      {
        'needRefresh': true,
        'page': 0,
        'id': 0,
        'userId': 0,
        'orderType': 'SELL',
        'exrate': '0.00205557',
        'amountBase': '3182.000000000',
        'amountConvert': '0.017682374',
        'ordersIds': '9788456 9788967'
      },
      {
        'needRefresh': true,
        'page': 0,
        'id': 0,
        'userId': 0,
        'orderType': 'SELL',
        'exrate': '0.00506979',
        'amountBase': '0.000200000',
        'amountConvert': '0.000000014',
        'ordersIds': '9788589 9789100'
      },
      {
        'needRefresh': true,
        'page': 0,
        'id': 0,
        'userId': 0,
        'orderType': 'SELL',
        'exrate': '0.03148956',
        'amountBase': '0.005403912',
        'amountConvert': '0.000170166',
        'ordersIds': '9788788 9789299'
      },
      {
        'needRefresh': true,
        'page': 0,
        'id': 0,
        'userId': 0,
        'orderType': 'SELL',
        'exrate': '0.02748961',
        'amountBase': '0.005579976',
        'amountConvert': '0.000175712',
        'ordersIds': '9788771 9789282'
      }
    ],
    'type': 'SELL',
    'currencyPairId': 1
  };

  public dataForSell: OrderItem [];
  public dataBurBuy: OrderItem [];
  public isBuy: boolean;

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
              private tradingService: TradingService,
              private ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.itemName = 'order-book';
    this.orderTypeClass = 'order-table--buy';

    this.elementHeight = 200;
    this.elementHeightMobile = 400;

    /** create test mock data */
    // this.setMockData();

    this.isBuy = true;

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
        console.log(pair);
        this.activeCurrencyPair = pair;
        this.updateSubscription(pair);
        this.loadMinAndMaxValues(pair);
        // this.sellOrders = [];
        // this.buyOrders = [];
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

  loadMinAndMaxValues(pair: CurrencyPair) {
    /**
     * this method returns min and max rate for active currency pair
     * see example in service implementation
     */
    this.orderBookService.getMinAndMaxDayOrders(this.activeCurrencyPair.currencyPairId)
      .subscribe(res => {
          console.log(res);
        },
        error1 => {
          console.log(error1);
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
    this.orderBookService.subscribeStompOrders(pair)
      .pipe(map(orders => orders.filter ? orders.filter(order => order.type === 'SELL') : orders.type === 'SELL'))
      .pipe(map(orders => orders[0] ? orders[0].data : orders.data))
      .subscribe(orders => this.sellOrders = orders);
    this.orderBookService.subscribeStompOrders(pair)
      .pipe(map(orders => orders.filter ? orders.filter(order => order.type === 'BUY') : orders.type === 'BUY'))
      .pipe(map(orders => orders[0] ? orders[0].data : orders.data))
      .subscribe(orders => {
        this.buyOrders = orders;
        this.setData();
        // TODO: remove after dashboard init load time issue is solved
        // this.ref.detectChanges();
      });
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

  private getBestitems(isBuy: boolean, count: number = 10) {
    this.dataBurBuy = this.buyOrders.slice(0, count);
    this.dataForSell = this.sellOrders.slice(0, count);

    this.setDataForVisualization();
  }

  private getPercentageOfTheNumber(number: number, isBuy: boolean): string {
    const coefficient = isBuy ?  (this.maxBuy / number) : (this.maxSell / number);
    return (((100 / coefficient) - 40) + '%');
  }

  private getMaxDataOfArray(array: [number]): number {
    return Math.max.apply(null, array);
  }

  private onSelectOrder(orderIndex, item: OrderItem): void {
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

  private setMockData(): void {
    this.addOrUpdate(this.sellOrders, this.sellJson['data']);
    this.addOrUpdate(this.buyOrders, this.buyJson['data']);
  }

  private setData(): void {
    this.sortBuyData();
    this.getBestitems(true);

    this.sortSellData();
    this.getBestitems(false);
  }
}
