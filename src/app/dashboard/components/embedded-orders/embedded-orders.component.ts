import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { takeUntil, withLatestFrom } from 'rxjs/internal/operators';
import { AbstractDashboardItems } from '../../abstract-dashboard-items';
import { select, Store } from '@ngrx/store';
import {
  State,
  getActiveCurrencyPair,
  getOpenOrders,
  getOpenOrdersCount,
  getHistoryOrders,
  getOrdersLoading,
  getUserInfo
} from 'app/core/reducers/index';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import {
  LoadHistoryOrdersAction,
  SetHistoryOrdersAction,
  SetOpenOrdersAction
} from 'app/dashboard/actions/dashboard.actions';
import { DashboardWebSocketService } from 'app/dashboard/dashboard-websocket.service';

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

  constructor(private store: Store<State>, private dashboardService: DashboardWebSocketService) {
    super();
  }

  ngOnInit() {
    this.itemName = 'orders';
    this.loading$ = this.store.pipe(select(getOrdersLoading));
    this.openOrders$ = this.store.pipe(select(getOpenOrders));
    this.openOrdersCount$ = this.store.pipe(select(getOpenOrdersCount));
    this.historyOrders$ = this.store.pipe(select(getHistoryOrders));

    this.store
      .pipe(select(getActiveCurrencyPair))
      .pipe(withLatestFrom(this.store.select(getUserInfo)))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([pair, userInfo]: [SimpleCurrencyPair, ParsedToken]) => {
        this.userInfo = userInfo;
        this.activeCurrencyPair = pair;
        this.resetOrders();
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

  resetOrders(): void {
    this.store.dispatch(
      new SetOpenOrdersAction({
        openOrders: [],
        count: 0,
      })
    );
    this.store.dispatch(
      new SetHistoryOrdersAction({
        historyOrders: [],
        count: 0,
      })
    );
  }

  /**
   * switch main tab
   * @param {string} tabName
   */
  toggleMainTab(tabName: string): void {
    this.mainTab = tabName;
    if (this.mainTab === 'history') {
      this.toHistory();
    }
  }

  toOpenOrders(): void {
    this.loadOpenOrdersDashboard(this.activeCurrencyPair.name, this.userInfo.publicId);
  }

  loadOpenOrdersDashboard(pairName: string, publicId: string) {
    this.dashboardService
      .openOrdersSubscription(pairName, publicId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        this.store.dispatch(
          new SetOpenOrdersAction({
            openOrders: data,
            count: data.length,
          })
        );
      });
  }

  toHistory(): void {
    this.store.dispatch(new LoadHistoryOrdersAction(this.activeCurrencyPair.id));
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
