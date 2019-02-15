import {Component, EventEmitter, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Subject, forkJoin, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';

import {AbstractDashboardItems} from '../../abstract-dashboard-items';
import {AuthService} from 'app/shared/services/auth.service';
import {CurrencyPair} from '../../../model/currency-pair.model';
import {select, Store} from '@ngrx/store';
import {State, getCurrencyPair} from 'app/core/reducers/index';
import {EmbeddedOrdersService} from './embedded-orders.service';
import {DashboardService} from '../../dashboard.service';

@Component({
  selector: 'app-embedded-orders',
  templateUrl: './embedded-orders.component.html',
  styleUrls: ['./embedded-orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmbeddedOrdersComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  /** dashboard item name (field for base class)*/
  public itemName: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  refreshOrdersSubscription = new Subscription();


  public mainTab = 'open';
  public openOrdersCount = 0;
  public activeCurrencyPair: CurrencyPair;
  public historyOrders;
  public openOrders;
  public arrPairName = ['', ''];


  constructor(
    private store: Store<State>,
    private authService: AuthService,
    // private mockData: MockDataService,
    private ordersService: EmbeddedOrdersService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.itemName = 'orders';

    /** mock data */
    // this.openOrders = this.mockData.getOpenOrders().items;
    // this.historyOrders = this.mockData.getOpenOrders().items;
    // this.activeCurrencyPair = this.mockData.getMarketsData()[2];
    /** ---------------------------------------------- */

    this.store
      .pipe(select(getCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPair) => {
        this.activeCurrencyPair = pair;
          this.toOpenOrders();
          this.toHistory();
      });
      // if (this.authService.isAuthenticated()) {
      //   this.ordersService.setFreshOpenOrdersSubscription(this.authService.getUsername());
      //   this.refreshOrdersSubscription = this.ordersService.personalOrderListener.subscribe(msg => {
      //   this.toOpenOrders();
      //   });
      // }

    this.dashboardService.newOrderWasCreated$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
      if (res) {
          this.toOpenOrders();
          this.toHistory();
      }
    });
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
   * request to get open-orders data
   */
  toOpenOrders(): void {
    this.ordersService.getOpenOrders(this.activeCurrencyPair.currencyPairId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.openOrders = data.items;
        this.openOrdersCount = data.count;
        this.cdr.detectChanges();
      });
  }

  /**
   * request to get history data with status (CLOSED and CANCELED)
   */
  toHistory(): void {
    this.ordersService.getHistory(this.activeCurrencyPair.currencyPairId, 'CLOSED')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.historyOrders = data.items;
        this.cdr.detectChanges();
      });

  }

  public pairNames(): string [] {
    if (this.activeCurrencyPair && this.activeCurrencyPair.currencyPairName) {
      return this.activeCurrencyPair.currencyPairName.split('/');
    }
    return ['BTC', 'USD'];
  }

  public pairName(): string {
    if (this.activeCurrencyPair) {
      return this.activeCurrencyPair.currencyPairName;
    }
    return 'BTC/USD';
  }
}
