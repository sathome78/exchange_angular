import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {Subject, forkJoin, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';

import {AbstractDashboardItems} from '../../abstract-dashboard-items';
import {AuthService} from 'app/services/auth.service';
import {CurrencyPair} from '../../../model/currency-pair.model';
import {select, Store} from '@ngrx/store';
import {State, getCurrencyPair} from 'app/core/reducers/index';
import {EmbeddedOrdersService} from './embedded-orders.service';

@Component({
  selector: 'app-embedded-orders',
  templateUrl: './embedded-orders.component.html',
  styleUrls: ['./embedded-orders.component.scss']
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
    private ordersService: EmbeddedOrdersService
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
      .subscribe( (pair: CurrencyPair) => {
        this.activeCurrencyPair = pair;
        this.toOpenOrders();
      });
      // if (this.authService.isAuthenticated()) {
      //   this.ordersService.setFreshOpenOrdersSubscription(this.authService.getUsername());
      //   this.refreshOrdersSubscription = this.ordersService.personalOrderListener.subscribe(msg => {
      //   this.toOpenOrders();
      //   });
      // }
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
    const sub = this.ordersService.getOpenOrders(this.activeCurrencyPair.currencyPairId)
      .subscribe(data => {
        this.openOrders = data.items;
        this.openOrdersCount = data.count;
        sub.unsubscribe();

        // TODO: remove after dashboard init load time issue is solved
        // this.ref.detectChanges();
      });
  }

  /**
   * request to get history data with status (CLOSED and CANCELED)
   */
  toHistory(): void {
    const forkSubscription = forkJoin(
      this.ordersService.getHistory(this.activeCurrencyPair.currencyPairId, 'CLOSED'),
      this.ordersService.getHistory(this.activeCurrencyPair.currencyPairId, 'CANCELLED')
    )
      .subscribe(([res1, res2]) => {
        this.historyOrders = [...res1.items, ...res2.items];
        forkSubscription.unsubscribe();
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
