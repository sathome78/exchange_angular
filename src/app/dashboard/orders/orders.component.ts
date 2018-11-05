import {Component, EventEmitter, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
import {AbstractDashboardItems} from '../abstract-dashboard-items';
import {MockDataService} from '../../services/mock-data.service';
import {OrdersService} from './orders.service';
import {MarketService} from '../markets/market.service';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import { forkJoin} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs/index';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  /** dashboard item name (field for base class)*/
  public itemName: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  refreshOrdersSubscription = new Subscription();


  public mainTab = 'open';
  public openOrdersCount = 0;
  public activeCurrencyPair;
  public historyOrders;
  public openOrders;
  public arrPairName;


  constructor(
    private authService: AuthService,
    private mockData: MockDataService,
    private ordersService: OrdersService,
    private marketService: MarketService,
    private ref: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.itemName = 'orders';

    /** mock data */
    this.openOrders = this.mockData.getOpenOrders().items;
    this.historyOrders = this.mockData.getOpenOrders().items;
    this.activeCurrencyPair = this.mockData.getMarketsData()[2];
    this.splitPairName();
    /** ---------------------------------------------- */

    this.marketService.activeCurrencyListener
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.activeCurrencyPair = res;
        this.splitPairName();
        this.toOpenOrders();
    });
    if (this.authService.isAuthenticated()) {
      this.ordersService.setFreshOpenOrdersSubscription(this.authService.getUsername());
      this.refreshOrdersSubscription = this.ordersService.personalOrderListener.subscribe(msg => {
        this.toOpenOrders();
      });
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.ordersService.unsubscribeStomp();
    this.refreshOrdersSubscription.unsubscribe();
  }

  /**
   * switch main tab
   * @param {string} tabName
   */
  toggleMainTab(tabName: string): void {
    this.mainTab = tabName;
    this.mainTab === 'open' ?
      this.toOpenOrders() :
      this.toHistory();
  }

  /**
   * split pair name method
   */
  private splitPairName(): void {
    this.arrPairName = this.activeCurrencyPair.currencyPairName.split('/');
  }

  /**
   * request to get open-orders data
   */
  toOpenOrders(): void {
    if (this.activeCurrencyPair) {
      const sub = this.ordersService.getOpenOrders(this.activeCurrencyPair.currencyPairId)
        .subscribe(data => {
          this.openOrders = data.items;
          this.openOrdersCount = data.count;
          sub.unsubscribe();
        });
    }
  }

  /**
   * request to get history data with status (CLOSED and CANCELED)
   */
  toHistory(): void {
    if (this.activeCurrencyPair) {
      const forkSubscription = forkJoin(
        this.ordersService.getHistory(this.activeCurrencyPair.currencyPairId, 'CLOSED'),
        this.ordersService.getHistory(this.activeCurrencyPair.currencyPairId, 'CANCELLED')
      )
        .subscribe(([res1, res2]) => {
          this.historyOrders = [...res1.items, ...res2.items];
          forkSubscription.unsubscribe();
        });
    }
  }

}
