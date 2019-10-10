import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import {
  getActiveCurrencyPair,
  State,
  getOpenOrders,
  getHistoryOrders,
  getOrdersLoading,
  getOpenOrdersCount,
  getUserInfo
} from '../../../core/reducers';
import { Subject, Observable } from 'rxjs';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import {
  LoadHistoryOrdersAction,
  SetOpenOrdersAction
} from 'app/dashboard/actions/dashboard.actions';
import { SetHistoryOrdersAction } from 'app/orders/store/actions/orders.actions';
import { DashboardWebSocketService } from 'app/dashboard/dashboard-websocket.service';

@Component({
  selector: 'app-embedded-orders-mobile',
  templateUrl: './embedded-orders-mobile.component.html',
  styleUrls: ['./embedded-orders-mobile.component.scss'],
})
export class EmbeddedOrdersMobileComponent implements OnInit, OnDestroy {
  public mainTab = 'open';
  public activeCurrencyPair: SimpleCurrencyPair;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public historyOrders$: Observable<any>;
  public openOrders$: Observable<any>;
  public openOrdersCount$: Observable<number>;
  public loading$: Observable<boolean>;
  public userInfo: ParsedToken;

  constructor(
    private store: Store<State>,
    private dashboardService: DashboardWebSocketService
  ) { }

  ngOnInit() {
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

  toggleMainTab(tabName: string): void {
    this.mainTab = tabName;
    this.mainTab === 'open' ? this.toOpenOrders() : this.toHistory();
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
}
