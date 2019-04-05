import {Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';

import {AbstractDashboardItems} from '../../abstract-dashboard-items';
import {select, Store} from '@ngrx/store';
import {State, getActiveCurrencyPair, getLastCreatedOrder} from 'app/core/reducers/index';
import {EmbeddedOrdersService} from './embedded-orders.service';
import {Order} from 'app/model/order.model';
import {SimpleCurrencyPair} from 'app/model/simple-currency-pair';
import {UserService} from 'app/shared/services/user.service';

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
  public activeCurrencyPair: SimpleCurrencyPair;
  public historyOrders;
  public openOrders;
  public loading: boolean = false;


  constructor(
    private store: Store<State>,
    private userService: UserService,
    private ordersService: EmbeddedOrdersService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.itemName = 'orders';

    this.store
      .pipe(select(getActiveCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: SimpleCurrencyPair) => {
        this.activeCurrencyPair = pair;
        this.toOpenOrders();
        this.toHistory();
      });

    this.store
      .pipe(select(getLastCreatedOrder))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((order: Order) => {
        this.toOpenOrders();
        this.toHistory();
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
    this.loading = true;
    this.ordersService.getOpenOrders(this.activeCurrencyPair.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.openOrders = data.items;
        this.openOrdersCount = data.count;
        this.loading = false;
        this.cdr.detectChanges();
      }, err => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  /**
   * request to get history data with status (CLOSED and CANCELED)
   */
  toHistory(): void {
    this.loading = true;
    this.ordersService.getHistory(this.activeCurrencyPair.id, 'CLOSED')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.historyOrders = data.items;
        this.loading = false;
        this.cdr.detectChanges();
      }, err => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      });

  }

  refreshOpenOrders() {
    this.toOpenOrders();
    this.userService.getUserBalance(this.activeCurrencyPair);
  }

  public pairNames(): string [] {
    if (this.activeCurrencyPair && this.activeCurrencyPair.name) {
      return this.activeCurrencyPair.name.split('/');
    }
    return ['BTC', 'USD'];
  }

  public pairName(): string {
    if (this.activeCurrencyPair) {
      return this.activeCurrencyPair.name;
    }
    return 'BTC/USD';
  }
}
