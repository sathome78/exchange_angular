import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

import { AbstractDashboardItems } from '../../abstract-dashboard-items';
import { select, Store } from '@ngrx/store';
import {
  State,
  getActiveCurrencyPair,
  getOpenOrders,
  getOpenOrdersCount,
  getHistoryOrders,
  getOrdersLoading,
  getUserInfo,
} from 'app/core/reducers/index';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { UserService } from 'app/shared/services/user.service';
import { LoadOpenOrdersAction, LoadHistoryOrdersAction } from 'app/dashboard/actions/dashboard.actions';

@Component({
  selector: 'app-embedded-orders',
  templateUrl: './embedded-orders.component.html',
  styleUrls: ['./embedded-orders.component.scss'],
})
export class EmbeddedOrdersComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  /** dashboard item name (field for base class)*/
  public itemName: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public mainTab = 'open';
  public activeCurrencyPair: SimpleCurrencyPair;
  public userInfo: ParsedToken;
  public historyOrders$: Observable<any>;
  public openOrders$: Observable<any>;
  public openOrdersCount$: Observable<number>;
  public loading$: Observable<boolean>;

  constructor(private store: Store<State>, private userService: UserService) {
    super();
    this.store
      .pipe(select(getUserInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userInfo: ParsedToken) => {
        this.userInfo = userInfo;
      });
  }

  ngOnInit() {
    this.itemName = 'orders';
    this.loading$ = this.store.pipe(select(getOrdersLoading));
    this.openOrders$ = this.store.pipe(select(getOpenOrders));
    this.openOrdersCount$ = this.store.pipe(select(getOpenOrdersCount));
    this.historyOrders$ = this.store.pipe(select(getHistoryOrders));

    this.store
      .pipe(select(getActiveCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: SimpleCurrencyPair) => {
        this.activeCurrencyPair = pair;
        this.toOpenOrders();
        this.toHistory();
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public get isVipUser() {
    if (this.userInfo) {
      return this.userInfo.userRole === 'VIP_USER';
    }
    return false;
  }

  /**
   * switch main tab
   * @param {string} tabName
   */
  toggleMainTab(tabName: string): void {
    this.mainTab = tabName;
    this.mainTab === 'open' ? this.toOpenOrders() : this.toHistory();
  }

  toOpenOrders(): void {
    this.store.dispatch(new LoadOpenOrdersAction(this.activeCurrencyPair.id));
  }

  toHistory(): void {
    this.store.dispatch(new LoadHistoryOrdersAction(this.activeCurrencyPair.id));
  }

  refreshOpenOrders() {
    this.toOpenOrders();
    this.userService.getUserBalance(this.activeCurrencyPair);
  }

  public pairNames(): string[] {
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
