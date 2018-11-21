import {Component, OnDestroy, OnInit, ElementRef, ViewChild} from '@angular/core';
import {setHostBindings} from '@angular/core/src/render3/instructions';
import {forEach} from '@angular/router/src/utils/collection';
import {renderDetachView} from '@angular/core/src/view/view_attach';
import {ChildActivationStart} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {map, takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import * as _reduce from 'lodash/reduce';

import {AbstractDashboardItems} from '../../abstract-dashboard-items';
import {OrderBookService} from './order-book.service';
import {MarketService} from '../markets/market.service';
import {DashboardService} from '../../dashboard.service';
import {TradingService} from '../trading/trading.service';
import {CurrencyPair} from 'app/model/currency-pair.model';
import {State, getCurrencyPair, getLastSellBuyOrder, getCurrencyPairInfo} from 'app/core/reducers/index';
import {OrderItem} from 'app/model/order-item.model';
import {MockDataService} from '../../../services/mock-data.service';
import {ChangeCurrencyPairAction, SelectedOrderBookOrderAction, SetLastSellBuyOrderAction} from '../../actions/dashboard.actions';
import {LastSellBuyOrder} from '../../../model/last-sell-buy-order.model';
import {defaultLastSellBuyOrder} from '../../reducers/default-values';
import {TradeItem} from '../../../model/trade-item.model';
import {CurrencyPairInfo} from '../../../model/currency-pair-info.model';

@Component({
  selector: 'app-order-book',
  templateUrl: 'order-book.component.html',
  styleUrls: ['order-book.component.scss']
})
export class OrderBookComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  /** dashboard item name (field for base class)*/
  public itemName: string;
  // public lastOrder = {exrate: null, amountBase: null};
  public lastOrderUp = true;
  public currencyPairInfo;
  public forBuyTotalCalculate;
  public forSellTotalCalculate;
  public showFraction = 8;


  @ViewChild('mainContent')
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

  // public lastSellOrder;
  // public lastBuyOrder;
  public lastSellBuyOrders: LastSellBuyOrder;

  refreshedIds: number[] = [];

  /** stores data for drawing a border for a chart */
  withForChartLineElements: {
    sell: string[];
    buy: string[];
  };

  constructor(
    private store: Store<State>,
    private orderBookService: OrderBookService,
    private marketService: MarketService,
    private mockDataService: MockDataService,
    private dashboardService: DashboardService,
    private tradingService: TradingService) {
    super();
  }


  ngOnInit() {
    this.lastSellBuyOrders = defaultLastSellBuyOrder;
    this.itemName = 'order-book';
    this.orderTypeClass = 'order-table--buy';
    this.withForChartLineElements = {
      sell: [],
      buy: []
    };

    this.elementHeight = 200;
    this.elementHeightMobile = 400;

    /** create test mock data */
    this.maxExrate = '0';
    this.minExrate = '0';
    this.setMockData();

    this.isBuy = true;

    this.store
      .pipe(select(getCurrencyPairInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPairInfo) => {
        this.currencyPairInfo = pair;
      });

    this.store
      .pipe(select(getCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPair) => {
        this.activeCurrencyPair = pair;
        this.updateSubscription(pair);
        this.loadMinAndMaxValues(pair);
      });

    this.store
      .pipe(select(getLastSellBuyOrder))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((orders) => {
        this.lastSellBuyOrders = orders;
        this.lastOrderUp = orders.lastOrder.operationType === 'SELL';
      });

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
    // this.currencySubscription = this.marketService.activeCurrencyListener
    //   .subscribe(pair => {
    //
    //     console.log(pair);
    //     this.activeCurrencyPair = pair;
    //     this.updateSubscription(pair);
    //     this.loadMinAndMaxValues(pair);
    //     // this.sellOrders = [];
    //     // this.buyOrders = [];
    //   });
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.currencySubscription.unsubscribe();
    this.orderBookService.unsubscribeStompForSellOrders();
    this.orderBookService.unsubscribeStompForBuyOrders();
    this.buyOrdersSubscription.unsubscribe();
    this.sellOrdersSubscription.unsubscribe();
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
    // this.sellOrders = [];
    // this.buyOrders = [];
    this.orderBookService.unsubscribeStompForSellOrders();
    this.orderBookService.unsubscribeStompForBuyOrders();
    this.orderBookService.subscribeStompOrders(pair)
      .pipe(map(orders => orders.filter ? orders.filter(order => order.type === 'SELL') : orders.type === 'SELL'))
      .pipe(map(orders => orders[0] ? orders[0].data : orders.data))
      .subscribe(orders => {
        this.sellOrders = orders;
      });
    this.orderBookService.subscribeStompOrders(pair)
      .pipe(map(orders => orders.filter ? orders.filter(order => order.type === 'BUY') : orders.type === 'BUY'))
      .pipe(map(orders => orders[0] ? orders[0].data : orders.data))
      .subscribe(orders => {
        this.buyOrders = orders;
        this.setData();
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

  /**
   * Increment or decrement show fraction
   * @param {boolean} type
   */
  incrementFraction(type: boolean): void {
    if (type === true && this.showFraction < 8) {
      this.showFraction++;
    }
    if (type === false && this.showFraction > 1) {
      this.showFraction--;
    }
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
    this.sellOrders.sort((a, b) => a.exrate - b.exrate);

  }

  private getBestitems(isBuy: boolean, count: number = 8) {
    // this.dataBurBuy = this.sortOrders(this.buyOrders).reverse().slice(0, count);
    // this.dataForSell = this.sortOrders(this.sellOrders).reverse().slice(0, count);
    if (this.buyOrders) {
      this.dataBurBuy = this.buyOrders.slice(0, count);
      this.forBuyTotalCalculate = [...this.dataBurBuy];
      this.dataForSell = this.sellOrders.slice(0, count);
      this.forSellTotalCalculate = [...this.dataForSell];
      this.forSellTotalCalculate = this.forSellTotalCalculate.reverse();

      this.setDataForVisualization();
    }
  }

  getPercentageOfTheNumber(number: number, numberOf: number): number {
    const coefficient = numberOf / number;
    return (60 / coefficient);
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
    // this.dashboardService.selectedOrderTrading$.next(item);
    this.store.dispatch(new SelectedOrderBookOrderAction(item));

    this.dashboardService.activeMobileWidget.next(widgetName);
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
    this.setWidthForChartBorder();
  }

  private setMockData(): void {
    this.addOrUpdate(this.sellOrders, this.mockDataService.getSellJson()['data']);
    this.addOrUpdate(this.buyOrders, this.mockDataService.getBuyJson()['data']);
  }

  setWidthForChartBorder() {
    this.withForChartLineElements.buy = [];
    this.withForChartLineElements.sell = [];

    if (this.orderbookConainer) {
      const containerWidth = parseInt(this.orderbookConainer.nativeElement.clientWidth, 10);
      console.log('sell', this.sellOrders);
      console.log('buy', this.buyOrders);

      for (let i = 0; i < 7; i++) {
        /** for buy */
        if (this.buyOrders[i] && this.buyOrders[i + 1]) {
          const tempElementBuy = this.getPercentageOfTheMuxBuyOrSell(this.buyOrders[i].exrate, true);
          const nextElementBuy = this.getPercentageOfTheMuxBuyOrSell(this.buyOrders[i + 1].exrate, true);
          const valueForBuy = nextElementBuy - tempElementBuy;
          this.withForChartLineElements.buy[i] = ((containerWidth / 100) * valueForBuy) + 'px';
        }

        /** for sell */
        if (this.sellOrders[i] && this.sellOrders[i + 1]) {
          const tempElementSell = this.getPercentageOfTheMuxBuyOrSell(this.sellOrders[i].exrate, false);
          const nextElementSell = this.getPercentageOfTheMuxBuyOrSell(this.sellOrders[i + 1].exrate, false);
          const valueforSell = tempElementSell - nextElementSell;

          this.withForChartLineElements.sell[i] = (((containerWidth / 100) * valueforSell)) * -1 + 'px';
        }
      }
    }
  }

  private getPercentageOfTheMuxBuyOrSell(number: number, isBuy: boolean): number {
    const coefficient = isBuy ? (this.maxBuy / number) : (this.maxSell / number);
    return 95 / coefficient;
  }

  private setData(): void {
    this.sortBuyData();
    this.getBestitems(true);

    this.sortSellData();
    this.getBestitems(false);
  }
}
