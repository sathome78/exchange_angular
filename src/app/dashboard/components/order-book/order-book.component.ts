import {Component, OnDestroy, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import * as _reduce from 'lodash/reduce';

import {AbstractDashboardItems} from '../../abstract-dashboard-items';
import {OrderBookService} from './order-book.service';
import {DashboardService} from '../../dashboard.service';
import {TradingService} from '../trading/trading.service';
import {CurrencyPair} from 'app/model/currency-pair.model';
import {State, getCurrencyPair, getCurrencyPairInfo} from 'app/core/reducers/index';
import {OrderItem} from 'app/model/order-item.model';
import {
  SelectedOrderBookOrderAction,
  SetLastPriceAction,
} from '../../actions/dashboard.actions';
import {CurrencyPairInfo} from '../../../model/currency-pair-info.model';
import {UtilsService} from '../../../shared/services/utils.service';
import {DashboardWebSocketService} from 'app/dashboard/dashboard-websocket.service';

@Component({
  selector: 'app-order-book',
  templateUrl: 'order-book.component.html',
  styleUrls: ['order-book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  public lastExrate;
  public preLastExrate;
  public isExratePositive = true;
  public loading: boolean = true;

  @ViewChild('mainContent')
  orderbookConainer: ElementRef;

  public dataForSell: OrderItem [];
  public dataBurBuy: OrderItem [];
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

  public sellVisualizationArray = [];
  public buyVisualizationArray = [];
  public showSellDataRverse = [];
  public showBuyDataRverse = [];

  private buyOrdersSubscription: any;
  private sellOrdersSubscription: any;
  activeCurrencyPair: CurrencyPair;
  currencySubscription: any;
  orderTypeClass: string;
  public commonSellTotal = 0;
  public commonBuyTotal = 0;
  public lastCoefficient;
  public splitCurrencyName = ['', ''];

  // public lastSellOrder;
  // public lastBuyOrder;
  // public lastSellBuyOrders: LastSellBuyOrder;

  refreshedIds: number[] = [];


  /** stores data for drawing a border for a chart */
  withForChartLineElements: {
    sell: string[];
    buy: string[];
  };

  /** precision value for orders */
  public precision = 0.00001;
  public precisionOut = 5;

  constructor(
    private store: Store<State>,
    private orderBookService: OrderBookService,
    private dashboardService: DashboardService,
    private dashboardWebsocketService: DashboardWebSocketService,
    private utils: UtilsService,
    private crd: ChangeDetectorRef,
    private tradingService: TradingService) {
    super();
  }

  ngOnInit() {

    this.lastExrate = 0;
    // this.lastSellBuyOrders = defaultLastSellBuyOrder;
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
    // this.setMockData();

    this.isBuy = true;
    this.loading = true;


    this.store
      .pipe(select(getCurrencyPairInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPairInfo) => {
        this.currencyPairInfo = pair;
        this.crd.detectChanges();
      });

    this.store
      .pipe(select(getCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPair) => {
        this.activeCurrencyPair = pair;
        this.splitCurrencyName = pair.currencyPairName.split('/');
        if(pair.currencyPairId !== 0) {
          this.initData(pair);
          this.loadMinAndMaxValues(pair);
        }
        this.crd.detectChanges()
      });

    this.dashboardWebsocketService.setRabbitStompSubscription()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair) => {
        this.initData(pair);
        this.loadMinAndMaxValues(pair);
      })

    // this.store
    //   .pipe(select(getLastSellBuyOrder))
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe((orders) => {
    //     this.lastSellBuyOrders = orders;
    //     this.lastOrderUp = orders.lastOrder.operationType === 'SELL';
    //   });

    this.tradingService.tradingChangeSellBuy$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
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
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    if (this.currencySubscription) {
      this.currencySubscription.unsubscribe();
    }
  }

  /**
   * Method transform exponent format to number
   * @param x
   * @returns {any}
   */
  exponentToNumber(x) {
    if (Math.abs(x) < 1.0) {
      let e = parseInt(x.toString().split('e-')[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      let e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += (new Array(e + 1)).join('0');
      }
    }
    return x;
  }

  private initData(pair: CurrencyPair) {
    /** mock data*/
    // const orders = [this.mock, this.mockBuy]
    // orders[0].orderType === 'SELL' ? this.setSellOrders(orders[0]) :  this.setSellOrders(orders[1]);
    // orders[0].orderType === 'BUY' ? this.setBuyOrders(orders[0]) :  this.setBuyOrders(orders[1]);
    // this.lastExrate = orders[0].lastExrate !== '0' ? orders[0].lastExrate : 0;
    // this.preLastExrate = orders[0].preLastExrate !== '0' ? orders[0].preLastExrate : 0;
    // this.isExratePositive = orders[0].positive;
    // this.setData();
    /** ------------------ */

    this.orderBookService.getOrderbookDateOnInit(pair, this.precisionOut)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(orders => {
        orders[0].orderType === 'SELL' ? this.setSellOrders(orders[0]) : this.setSellOrders(orders[1]);
        orders[0].orderType === 'BUY' ? this.setBuyOrders(orders[0]) : this.setBuyOrders(orders[1]);
        this.lastExrate = orders[0].lastExrate !== '0' ? orders[0].lastExrate : 0;
        this.preLastExrate = orders[0].preLastExrate !== '0' ? orders[0].preLastExrate : 0;
        this.isExratePositive = orders[0].positive;
        const lastPrice = {
          flag: orders[0].positive,
          price: orders[0].lastExrate
        }
        this.store.dispatch(new SetLastPriceAction(lastPrice))
        this.setData();
        this.loadingFinished();
        this.crd.detectChanges();
      });
  }

  sellCalculateVisualization() {
    this.sellVisualizationArray = [];
    for (let i = 0; i < this.sellOrders.length; i++) {
      const coefficient = (+this.commonSellTotal / +this.sellOrders[i].total);
      this.sellVisualizationArray.push(98 / coefficient);
    }
    this.sellVisualizationArray = [...this.sellVisualizationArray.reverse()];
  }

  buyCalculateVisualization() {
    this.buyVisualizationArray = [];
    if (this.buyOrders[this.buyOrders.length - 1]) {
      this.lastCoefficient = 98 - (98 - (98 / (+this.commonBuyTotal / +this.buyOrders[this.buyOrders.length - 1].total)));
    }
    for (let i = 0; i < this.buyOrders.length; i++) {
      const coefficient = (+this.commonBuyTotal / +this.buyOrders[i].total);
      this.buyVisualizationArray.push(((98 / coefficient)));
    }
    this.buyVisualizationArray = [...this.buyVisualizationArray];
  }

  // buyCalculateVisualization() {
  //   this.buyVisualizationArray = [];
  //   if (this.buyOrders[this.buyOrders.length - 1]) {
  //     this.lastCoefficient = 98 - (98 - (98 / (+this.commonBuyTotal / +this.buyOrders[this.buyOrders.length - 1].total)));
  //   }
  //   for (let i = 0; i < this.buyOrders.length; i++) {
  //       const coefficient = (+this.commonBuyTotal / +this.buyOrders[i].total);
  //       this.buyVisualizationArray.push((98 - (98 / coefficient)) + this.lastCoefficient);
  //   }
  //   this.buyVisualizationArray = [...this.buyVisualizationArray];
  // }

  private setBuyOrders(orders) {
    this.buyOrders = orders.orderBookItems;
    this.showBuyDataRverse = [...this.buyOrders];
    // this.buyOrders.push({
    //   amount: "6500",
    //   currencyPairId: 59,
    //   exrate: "200",
    //   orderType: "BUY",
    //   total: "50000",
    // })
    this.commonBuyTotal = +orders.total;
    this.buyCalculateVisualization();
  }

  private setSellOrders(orders) {
    this.sellOrders = orders.orderBookItems;
    this.showSellDataRverse = [...this.sellOrders];
    this.showSellDataRverse.reverse();
    this.commonSellTotal = orders.total;
    this.sellCalculateVisualization();
  }

  loadMinAndMaxValues(pair: CurrencyPair) {
    /**
     * this method returns min and max rate for active currency pair
     * see example in service implementation
     */
    this.orderBookService.getMinAndMaxDayOrders(this.activeCurrencyPair.currencyPairId);
    // .pipe(takeUntil(this.ngUnsubscribe))
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

  addOrUpdate(orders: OrderItem[], newItems: OrderItem[]) {
    if (orders.length === 0) {
      orders.push(...newItems);
      return;
    }
    newItems.forEach(newItem => {
      let found = false;
      orders.forEach(oldItem => {
        if (oldItem.id === newItem.id) {
          oldItem = {...newItem};
          found = true;
        }
      });
      if (!found) {
        orders.push(newItem);
      }
    });
  }


  /**
   * decrement precision with accuracy step 0.1
   */
  decPrecision(): void {
    if (this.precision <= 0.01) {
      this.precision *= 10;
      this.precisionOut--;
      this.initData(this.activeCurrencyPair);
    }
  }

  // public mockSend = {
  //   amount: "500000000",
  //   currencyPairId: 59,
  //   exrate: "0.00000029",
  //   orderType: "BUY",
  //   total: "500006510",
  // }


  /**
   * increment precision with accuracy step 0.1
   */
  incPrecision(): void {
    // this.store.dispatch(new SelectedOrderBookOrderAction(this.mockSend));
    if (this.precision >= 0.0001) {
      this.precision /= 10;
      this.precisionOut++;
      this.initData(this.activeCurrencyPair);
    }
  }

  private sortBuyData(): void {
    if (!this.buyOrders) {
      return;
    }
    this.buyOrders.sort((a, b) => +a.exrate - +b.exrate);
  }

  private sortSellData(): void {
    if (!this.sellOrders) {
      return;
    }
    this.sellOrders.sort((a, b) => +a.exrate - +b.exrate);

  }

  private loadingFinished() {
    this.loading = false;
  }

  private getBestitems(isBuy: boolean, count: number = 8) {
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

  /**
   * Select or
   *
   * @param orderIndex
   * @param item
   * @param widgetName
   */
  onSelectOrder(orderIndex: number, item: OrderItem, widgetName: string): void {
    /** sends the data in to trading */
    this.tradingService.needSetDefaultOrderBookItem = false;
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
      this.dataForVisualizationBuyOrders.push(+element.total);
    });

    // this.maxBuy = this.getMaxDataOfArray(this.dataForVisualizationBuyOrders);

    /** Sell */
    this.dataForSell.forEach((element, index) => {
      this.dataForVisualizationSellOrders.push(+element.total);
    });


    // this.dataForVisualization = [null];
    // this.data.forEach((element, index) => {
    //   console.log(element);
    //   this.dataForVisualization.push(element.exrate);
    // });
    // this.maxSell = this.getMaxDataOfArray(this.dataForVisualizationSellOrders);
    this.setWidthForChartBorder();
    // this.sellCalculateVisualization();
    // this.buyCalculateVisualization();
  }

  // private setMockData(): void {
  //   this.addOrUpdate(this.sellOrders, this.mockDataService.getSellJson()['data']);
  //   this.addOrUpdate(this.buyOrders, this.mockDataService.getBuyJson()['data']);
  // }

  setWidthForChartBorder() {
    this.withForChartLineElements.buy = [];
    this.withForChartLineElements.sell = [];

    if (this.orderbookConainer) {
      const containerWidth = parseInt(this.orderbookConainer.nativeElement.clientWidth, 10);

      for (let i = 0; i < 7; i++) {
        /** for buy */
        if (this.buyOrders[i] && this.buyOrders[i + 1]) {
          const tempElementBuy = this.getPercentageOfTheMuxBuyOrSell(+this.buyOrders[i].total, true);
          const nextElementBuy = this.getPercentageOfTheMuxBuyOrSell(+this.buyOrders[i + 1].total, true);
          const valueForBuy = tempElementBuy - nextElementBuy;
          this.withForChartLineElements.buy[i] = (((containerWidth / 100) * valueForBuy)) + 'px';
        }

        /** for sell */
        if (this.sellOrders[i] && this.sellOrders[i + 1]) {
          const tempElementSell = this.getPercentageOfTheMuxBuyOrSell(+this.sellOrders[i].total, false);
          const nextElementSell = this.getPercentageOfTheMuxBuyOrSell(+this.sellOrders[i + 1].total, false);
          const valueforSell = tempElementSell - nextElementSell;

          this.withForChartLineElements.sell[i] = (((containerWidth / 100) * valueforSell) * -1) + 'px';
        }
      }
      this.withForChartLineElements.sell.reverse();
      this.withForChartLineElements.buy.reverse();
    }
  }

  private getPercentageOfTheMuxBuyOrSell(number: number, isBuy: boolean): number {
    const coefficient = isBuy ? (this.commonBuyTotal / number) : (this.commonSellTotal / number);
    return 98 / coefficient;
  }


  private setData(): void {
    this.sortBuyData();
    this.getBestitems(true);

    this.sortSellData();
    this.getBestitems(false);
  }

}
