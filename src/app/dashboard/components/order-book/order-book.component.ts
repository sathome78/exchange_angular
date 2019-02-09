import {Component, OnDestroy, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {AbstractDashboardItems} from '../../abstract-dashboard-items';
import {OrderBookService} from './order-book.service';
import {CurrencyPair} from 'app/model/currency-pair.model';
import {State, getCurrencyPair, getCurrencyPairInfo} from 'app/core/reducers/index';
import {OrderItem} from 'app/model/order-item.model';
import {SelectedOrderBookOrderAction, SetLastPriceAction} from '../../actions/dashboard.actions';
import {CurrencyPairInfo} from '../../../model/currency-pair-info.model';
import {DashboardWebSocketService} from 'app/dashboard/dashboard-websocket.service';
import {OrderBookItem} from 'app/model';

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
  public currencyPairInfo: CurrencyPairInfo = null;

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

  public activeCurrencyPair: CurrencyPair;
  public commonSellTotal = 0;
  public commonBuyTotal = 0;
  public splitCurrencyName = ['', ''];

  /** stores data for drawing a border for a chart */
  public withForChartLineElements: {
    sell: string[];
    buy: string[];
  };

  /** precision value for orders */
  public precision = 0.00001;
  public precisionOut = 5;

  constructor(
    private store: Store<State>,
    private orderBookService: OrderBookService,
    private dashboardWebsocketService: DashboardWebSocketService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
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
      .pipe(select(getCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPair) => {
        this.activeCurrencyPair = pair;
        this.splitCurrencyName = pair.currencyPairName.split('/');
        if(pair.currencyPairId !== 0) {
          this.requestData(pair);
        }
      });

    this.dashboardWebsocketService.setRabbitStompSubscription()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair) => {
        this.requestData(pair);
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private initData(orders: OrderBookItem[]) {
    orders[0].orderType === 'SELL' ? this.setSellOrders(orders[0]) : this.setSellOrders(orders[1]);
    orders[0].orderType === 'BUY' ? this.setBuyOrders(orders[0]) : this.setBuyOrders(orders[1]);
    this.lastExrate = +orders[0].lastExrate;
    this.preLastExrate = +orders[0].preLastExrate;
    this.isExratePositive = orders[0].positive;
    const lastPrice = {
      flag: this.isExratePositive,
      price: this.lastExrate
    }
    this.store.dispatch(new SetLastPriceAction(lastPrice))
    this.setData();
  }

  private requestData(pair: CurrencyPair): void {
    this.orderBookService.getOrderBookDateOnInit(pair, this.precisionOut)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((orders: OrderBookItem[]) => {
        this.initData(orders);
        this.loadingFinished();
        this.cdr.detectChanges();
      });
  }

  public sellCalculateVisualization(): void {
    const visArr = [];
    for (let i = 0; i < this.sellOrders.length; i++) {
      const coefficient = (+this.commonSellTotal / +this.sellOrders[i].total);
      visArr.push(98 / coefficient);
    }
    this.sellVisualizationArray = [...visArr.reverse()];
  }

  public buyCalculateVisualization(): void {
    const visArr = [];
    for (let i = 0; i < this.buyOrders.length; i++) {
      const coefficient = (+this.commonBuyTotal / +this.buyOrders[i].total);
      visArr.push(((98 / coefficient)));
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

  /**
   * decrement precision with accuracy step 0.1
   */
  public decPrecision(): void {
    if (this.precision <= 0.01) {
      this.precision *= 10;
      this.precisionOut--;
      this.requestData(this.activeCurrencyPair);
    }
  }

  /**
   * increment precision with accuracy step 0.1
   */
  public incPrecision(): void {
    if (this.precision >= 0.0001) {
      this.precision /= 10;
      this.precisionOut++;
      this.requestData(this.activeCurrencyPair);
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

  public onSelectOrder(orderIndex: number, item: OrderItem, widgetName: string): void {
    /** sends the data in to trading */
    this.store.dispatch(new SelectedOrderBookOrderAction(item));

    // this.dashboardService.activeMobileWidget.next(widgetName); // Remove for mobile
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
    return 98 / coefficient;
  }


  private setData(): void {
    this.sortBuyData();
    this.sortSellData();
    this.setWidthForChartBorder();
  }

}
