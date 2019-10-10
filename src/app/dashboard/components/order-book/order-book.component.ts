import {
  Component,
  OnDestroy,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/internal/operators';
import { Subject } from 'rxjs/Subject';
import { AbstractDashboardItems } from '../../abstract-dashboard-items';
import { State, getActiveCurrencyPair, getCurrencyPairInfo } from 'app/core/reducers/index';
import { OrderItemOB } from 'app/model/order-item-orders-book.model';
import {
  SelectedOrderBookOrderAction,
  SetLastPriceAction,
  SetOrdersBookSellDataAction,
  SetOrdersBookBuyDataAction
} from '../../actions/dashboard.actions';
import { CurrencyPairInfo } from '../../../model/currency-pair-info.model';
import { DashboardWebSocketService } from 'app/dashboard/dashboard-websocket.service';
import { OrderBookItem } from 'app/model';
import { Subscription } from 'rxjs';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { Animations } from 'app/shared/animations';

@Component({
  selector: 'app-order-book',
  templateUrl: 'order-book.component.html',
  styleUrls: ['order-book.component.scss'],
  animations: [Animations.componentTriggerShowOrderBook],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderBookComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  public showContentOrderBook = false;
  @ViewChild('mainContent') public orderBookContainer: ElementRef;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  /** dashboard item name (field for base class)*/
  public itemName = 'order-book';
  private orderBookSub$: Subscription;
  public currencyPairInfo: CurrencyPairInfo = null;

  public maxCountCharacter = 18;

  private sellOrders: OrderItemOB[] = [];
  private buyOrders: OrderItemOB[] = [];
  public lastExrate = 0;
  public preLastExrate = 0;
  public isExratePositive = true;
  public loading = true;

  public sellVisualizationArray = [];
  public buyVisualizationArray = [];
  public showSellDataReverse = [];
  public showBuyDataReverse = [];

  public activeCurrencyPair: SimpleCurrencyPair;
  public commonSellTotal = 0;
  public commonBuyTotal = 0;
  public splitCurrencyName = ['', ''];

  public maxSellVisualizationWidth = 0;
  public maxBuyVisualizationWidth = 0;

  private lastSellTotal = 0;
  private lastBuyTotal = 0;

  private resizeTimeout;

  

  /** stores data for drawing a border for a chart */
  public withForChartLineElements: {
    sell: string[];
    buy: string[];
  };

  /** precision value for orders */
  public precision = 0.00001;
  public precisionOut = 5;

  public windowWidthForCalculate = [[1200, 1270, 15], [1270, 1340, 16], [1340, 1410, 17], [1410, 1480, 18]];

  constructor(
    private store: Store<State>,
    private dashboardWebsocketService: DashboardWebSocketService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {

    setTimeout(() => {
      this.showContentOrderBook = true;
      this.cdr.detectChanges();
    },5600)
    this.calculateMaxNumberLength();

    this.withForChartLineElements = {
      sell: [],
      buy: [],
    };
    this.store
      .pipe(select(getCurrencyPairInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPairInfo) => {
        this.currencyPairInfo = pair;
        this.cdr.detectChanges();
      });

    this.store
      .pipe(select(getActiveCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: SimpleCurrencyPair) => {
        this.activeCurrencyPair = pair;
        this.splitCurrencyName = pair.name.split('/');
        if (pair.id !== 0) {
          this.subscribeOrderBook(pair.name, this.precisionOut);
        }
        this.cdr.detectChanges();
      });
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(
      (() => {
        this.calculateMaxNumberLength();
      }).bind(this),
      500
    );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.unsubscribeOrderBook();
  }

  calculateMaxNumberLength() {
    const innerWidth = window.innerWidth;
    if (innerWidth > 1480) {
      this.maxCountCharacter = 19;
      this.cdr.detectChanges();
    } else {
      this.windowWidthForCalculate.map(item => {
        if (innerWidth > item[0] && innerWidth < item[1]) {
          this.maxCountCharacter = item[2];
          this.cdr.detectChanges();
        }
      });
    }
  }

  subscribeOrderBook(currName: string, precision: number): void {
    this.unsubscribeOrderBook();
    const pairName = currName.toLowerCase().replace(/\//i, '_');
    this.loadingStarted();
    this.orderBookSub$ = this.dashboardWebsocketService
      .orderBookSubscription(pairName, precision)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.setLastTotals(data);
        this.initData(data);
        this.loadingFinished();
        this.cdr.detectChanges();
      });
  }

  unsubscribeOrderBook() {
    if (this.orderBookSub$) {
      this.orderBookSub$.unsubscribe();
    }
  }

  private setLastTotals(orders: OrderBookItem[]): void {
    this.lastBuyTotal =
      !!orders[0] && orders[0].orderType === 'BUY'
        ? parseFloat(orders[0].total)
        : orders[1] && orders[1].orderType === 'BUY'
        ? parseFloat(orders[1].total)
        : this.lastBuyTotal;

    this.lastSellTotal =
      !!orders[0] && orders[0].orderType === 'SELL'
        ? parseFloat(orders[0].total)
        : orders[1] && orders[1].orderType === 'SELL'
        ? parseFloat(orders[1].total)
        : this.lastSellTotal;
  }

  private initData(orders: OrderBookItem[]) {
    if (!orders[0]) {
      return;
    }
    this.calculateVisualizationWidth(this.lastBuyTotal, this.lastSellTotal);

    orders[0].orderType === 'SELL' ? this.setSellOrders(orders[0]) : this.setBuyOrders(orders[0]);

    if (orders[1]) {
      orders[1].orderType === 'SELL' ? this.setSellOrders(orders[1]) : this.setBuyOrders(orders[1]);
    }
    this.buyCalculateVisualization(
      (!!orders[0] && orders[0].orderType === 'BUY') || (!!orders[1] && orders[1].orderType === 'BUY')
    );
    this.sellCalculateVisualization();
    this.lastExrate = +orders[0].lastExrate;
    this.preLastExrate = +orders[0].preLastExrate;
    this.isExratePositive = orders[0].positive;
    const lastPrice = {
      flag: this.isExratePositive,
      price: this.lastExrate,
    };
    this.store.dispatch(new SetLastPriceAction(lastPrice));
    this.setData();
  }

  public sellCalculateVisualization(): void {
    const visArr = [];
    for (let i = 0; i < this.sellOrders.length; i += 1) {
      const coefficient = +this.commonSellTotal / +this.sellOrders[i].total;
      visArr.push(this.maxSellVisualizationWidth / coefficient);
    }
    this.sellVisualizationArray = [...visArr.reverse()];
  }

  public buyCalculateVisualization(isReverse: boolean): void {
    const visArr = [];
    for (let i = 0; i < this.buyOrders.length; i += 1) {
      const coefficient = +this.commonBuyTotal / +this.buyOrders[i].total;
      visArr.push(this.maxBuyVisualizationWidth / coefficient);
    }
    this.buyVisualizationArray = isReverse ? [...visArr] : [...visArr.reverse()];
  }

  private setBuyOrders(orders): void {
    this.buyOrders = orders.orderBookItems;
    this.store.dispatch(new SetOrdersBookBuyDataAction(orders.orderBookItems));
    this.showBuyDataReverse = [...this.buyOrders];
    this.commonBuyTotal = +orders.total;
  }

  private setSellOrders(orders): void {
    this.store.dispatch(new SetOrdersBookSellDataAction(orders.orderBookItems));
    this.sellOrders = orders.orderBookItems;
    this.showSellDataReverse = [...this.sellOrders].reverse();
    this.commonSellTotal = +orders.total;
  }

  private calculateVisualizationWidth(buy, sell) {
    const widthItem = (buy + sell) / 98;
    const buyWidth = buy / widthItem;
    const sellWidth = sell / widthItem;
    this.maxBuyVisualizationWidth =
      buyWidth > sellWidth ? buyWidth + sellWidth : this.getRelativeWidth(sellWidth, buyWidth);
    this.maxSellVisualizationWidth =
      buyWidth < sellWidth ? buyWidth + sellWidth : this.getRelativeWidth(sellWidth, buyWidth);
  }

  getRelativeWidth(sellWidth: number, buyWidth: number) {
    const bigWidth = sellWidth > buyWidth ? sellWidth : buyWidth;
    const smallWidth = sellWidth < buyWidth ? sellWidth : buyWidth;

    return (smallWidth / bigWidth) * 98;
  }

  /**
   * decrement precision with accuracy step 0.1
   */
  public decPrecision(): void {
    if (this.precision <= 0.01) {
      this.precision *= 10;
      this.precisionOut -= 1;
      this.subscribeOrderBook(this.activeCurrencyPair.name, this.precisionOut);
    }
  }

  /**
   * increment precision with accuracy step 0.1
   */
  public incPrecision(): void {
    if (this.precision >= 0.0001) {
      this.precision /= 10;
      this.precisionOut += 1;
      this.subscribeOrderBook(this.activeCurrencyPair.name, this.precisionOut);
    }
  }

  private sortBuyData(): void {
    if (this.buyOrders) {
      this.buyOrders.sort((a, b) => +a.exrate - +b.exrate);
    }
  }

  private sortSellData(): void {
    if (this.sellOrders) {
      this.sellOrders.sort((a, b) => +a.exrate - +b.exrate);
    }
  }

  private loadingFinished(): void {
    this.loading = false;
  }
  private loadingStarted(): void {
    this.loading = true;
  }

  public onSelectOrder(item: OrderItemOB): void {
    this.store.dispatch(new SelectedOrderBookOrderAction({ ...item }));
  }

  public setWidthForChartBorder(): void {
    const buy = [];
    const sell = [];

    if (this.orderBookContainer) {
      const containerWidth = parseInt(this.orderBookContainer.nativeElement.clientWidth, 10);

      for (let i = 0; i < 7; i += 1) {
        /** for buy */
        if (this.buyOrders[i] && this.buyOrders[i + 1]) {
          const tempElementBuy = this.getPercentageOfTheMuxBuyOrSell(+this.buyOrders[i].total, true);
          const nextElementBuy = this.getPercentageOfTheMuxBuyOrSell(+this.buyOrders[i + 1].total, true);
          const valueForBuy = tempElementBuy - nextElementBuy;
          buy[i] = (containerWidth / 100) * valueForBuy + 'px';
        }

        /** for sell */
        if (this.sellOrders[i] && this.sellOrders[i + 1]) {
          const tempElementSell = this.getPercentageOfTheMuxBuyOrSell(+this.sellOrders[i].total, false);
          const nextElementSell = this.getPercentageOfTheMuxBuyOrSell(+this.sellOrders[i + 1].total, false);
          const valueForSell = tempElementSell - nextElementSell;

          sell[i] = (containerWidth / 100) * valueForSell * -1 + 'px';
        }
      }
      this.withForChartLineElements = {
        sell: sell.reverse(),
        buy: buy.reverse(),
      };
    }
  }

  private getPercentageOfTheMuxBuyOrSell(number: number, isBuy: boolean): number {
    const coefficient = isBuy ? this.commonBuyTotal / number : this.commonSellTotal / number;
    return isBuy ? this.maxBuyVisualizationWidth / coefficient : this.maxSellVisualizationWidth / coefficient;
  }

  private setData(): void {
    this.sortBuyData();
    this.sortSellData();
    this.setWidthForChartBorder();
    this.cdr.detectChanges();
  }
}
