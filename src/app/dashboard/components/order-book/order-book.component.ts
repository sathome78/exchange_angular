import {
  Component,
  OnDestroy,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
  HostListener
} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {AbstractDashboardItems} from '../../abstract-dashboard-items';
import {CurrencyPair} from 'app/model/currency-pair.model';
import {State, getActiveCurrencyPair, getCurrencyPairInfo} from 'app/core/reducers/index';
import {OrderItem} from 'app/model/order-item.model';
import {SelectedOrderBookOrderAction, SetLastPriceAction} from '../../actions/dashboard.actions';
import {CurrencyPairInfo} from '../../../model/currency-pair-info.model';
import {DashboardWebSocketService} from 'app/dashboard/dashboard-websocket.service';
import {OrderBookItem} from 'app/model';
import {Subscription} from 'rxjs';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';

@Component({
  selector: 'app-order-book',
  templateUrl: 'order-book.component.html',
  styleUrls: ['order-book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderBookComponent extends AbstractDashboardItems implements OnInit, OnDestroy {

  @ViewChild('mainContent') public orderBookContainer: ElementRef;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  /** dashboard item name (field for base class)*/
  public itemName: string = 'order-book';
  private orderBookSub$: Subscription;
  public currencyPairInfo: CurrencyPairInfo = null;

  public maxCountCharacter = 18;

  private sellOrders: OrderItem [] = [];
  private buyOrders: OrderItem [] = [];
  public lastExrate: number = 0;
  public preLastExrate:number = 0;
  public isExratePositive = true;
  public loading: boolean = true;

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

  private resizeTimeout;

  /** stores data for drawing a border for a chart */
  public withForChartLineElements: {
    sell: string[];
    buy: string[];
  };

  /** precision value for orders */
  public precision = 0.00001;
  public precisionOut = 5;

  public windowWidthForCalculate = [
    [1200, 1270, 15],
    [1270, 1340, 16],
    [1340, 1410, 17],
    [1410, 1480, 18],
  ]

  constructor(
    private store: Store<State>,
    private dashboardWebsocketService: DashboardWebSocketService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.calculateMaxNumberLength();

    this.withForChartLineElements = {
      sell: [],
      buy: []
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
        if(pair.id !== 0) {
          this.subscribeOrderBook(pair.name, this.precisionOut)
        }
        this.cdr.detectChanges()
      });
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout((() => {
     this.calculateMaxNumberLength();
    }).bind(this), 500);
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
    this.orderBookSub$ = this.dashboardWebsocketService.orderBookSubscription(pairName, precision)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        // console.log('order books', data);
        this.initData(data);
        this.loadingFinished();
        this.cdr.detectChanges();
      })
  }

  unsubscribeOrderBook() {
    if(this.orderBookSub$) {
      this.orderBookSub$.unsubscribe();
    }
  }

  private initData(orders: OrderBookItem[]) {
    if(!orders[0]) {
      return;
    }
    if (orders[0].orderType === 'SELL') {
      this.calculateVisualizationWidth(!!orders[1] ? parseFloat(orders[1].total) : 0, parseFloat(orders[0].total) || 0);
    } else {
      this.calculateVisualizationWidth(parseFloat(orders[0].total) || 0, !!orders[1] ? parseFloat(orders[1].total) : 0);
    }
    orders[0].orderType === 'SELL' ? this.setSellOrders(orders[0]) :
    orders[0].orderType === 'BUY' ? this.setBuyOrders(orders[0]) : null;
    if(orders[1]) {
      orders[1].orderType === 'SELL' ? this.setSellOrders(orders[1]) :
      orders[1].orderType === 'BUY' ? this.setBuyOrders(orders[1]) : null;
    }
    this.lastExrate = +orders[0].lastExrate;
    this.preLastExrate = +orders[0].preLastExrate;
    this.isExratePositive = orders[0].positive;
      const lastPrice = {
        flag: this.isExratePositive,
        price: this.lastExrate
      }
      this.store.dispatch(new SetLastPriceAction(lastPrice));
    this.setData();
  }

  public sellCalculateVisualization(): void {
    const visArr = [];
    for (let i = 0; i < this.sellOrders.length; i++) {
      const coefficient = (+this.commonSellTotal / +this.sellOrders[i].total);
      visArr.push(this.maxSellVisualizationWidth / coefficient);
    }
    this.sellVisualizationArray = [...visArr.reverse()];
  }

  public buyCalculateVisualization(): void {
    const visArr = [];
    for (let i = 0; i < this.buyOrders.length; i++) {
      const coefficient = (+this.commonBuyTotal / +this.buyOrders[i].total);
      visArr.push(((this.maxBuyVisualizationWidth / coefficient)));
    }
    this.buyVisualizationArray = [...visArr];
  }

  private setBuyOrders(orders): void {
    this.buyOrders = orders.orderBookItems;
    this.showBuyDataReverse = [...this.buyOrders];
    this.commonBuyTotal = +orders.total;
    this.buyCalculateVisualization();
  }

  private setSellOrders(orders): void {
    this.sellOrders = orders.orderBookItems;
    this.showSellDataReverse = [...this.sellOrders].reverse();
    this.commonSellTotal = +orders.total;
    this.sellCalculateVisualization();
  }

  private calculateVisualizationWidth(buy, sell) {
    const widthItem = (buy + sell) / 98;
    const buyWidth = buy / widthItem ;
    const sellWidth = sell / widthItem ;
    this.maxBuyVisualizationWidth = buyWidth > sellWidth ? (buyWidth + sellWidth) : buyWidth;
    this.maxSellVisualizationWidth = buyWidth < sellWidth ? (buyWidth + sellWidth) : sellWidth;
  }

  /**
   * decrement precision with accuracy step 0.1
   */
  public decPrecision(): void {
    if (this.precision <= 0.01) {
      this.precision *= 10;
      this.precisionOut--;
      this.subscribeOrderBook(this.activeCurrencyPair.name, this.precisionOut)
    }
  }

  /**
   * increment precision with accuracy step 0.1
   */
  public incPrecision(): void {
    if (this.precision >= 0.0001) {
      this.precision /= 10;
      this.precisionOut++;
      this.subscribeOrderBook(this.activeCurrencyPair.name, this.precisionOut)

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

  public onSelectOrder(item: OrderItem): void {
    this.store.dispatch(new SelectedOrderBookOrderAction(item));
  }

  public setWidthForChartBorder(): void {
    const buy = [];
    const sell = [];

    if (this.orderBookContainer) {
      const containerWidth = parseInt(this.orderBookContainer.nativeElement.clientWidth, 10);

      for (let i = 0; i < 7; i++) {
        /** for buy */
        if (this.buyOrders[i] && this.buyOrders[i + 1]) {
          const tempElementBuy = this.getPercentageOfTheMuxBuyOrSell(+this.buyOrders[i].total, true);
          const nextElementBuy = this.getPercentageOfTheMuxBuyOrSell(+this.buyOrders[i + 1].total, true);
          const valueForBuy = tempElementBuy - nextElementBuy;
          buy[i] = (((containerWidth / 100) * valueForBuy)) + 'px';
        }

        /** for sell */
        if (this.sellOrders[i] && this.sellOrders[i + 1]) {
          const tempElementSell = this.getPercentageOfTheMuxBuyOrSell(+this.sellOrders[i].total, false);
          const nextElementSell = this.getPercentageOfTheMuxBuyOrSell(+this.sellOrders[i + 1].total, false);
          const valueforSell = tempElementSell - nextElementSell;

          sell[i] = (((containerWidth / 100) * valueforSell) * -1) + 'px';
        }
      }
      this.withForChartLineElements = {
        sell: sell.reverse(),
        buy: buy.reverse(),
      };
    }
  }

  private getPercentageOfTheMuxBuyOrSell(number: number, isBuy: boolean): number {
    const coefficient = isBuy ? (this.commonBuyTotal / number) : (this.commonSellTotal / number);
    return (isBuy ? this.maxBuyVisualizationWidth / coefficient : this.maxSellVisualizationWidth / coefficient);
  }


  private setData(): void {
    this.sortBuyData();
    this.sortSellData();
    this.setWidthForChartBorder();
  }

}
