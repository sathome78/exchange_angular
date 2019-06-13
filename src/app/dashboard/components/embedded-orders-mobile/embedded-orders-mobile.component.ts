import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {
  getActiveCurrencyPair,
  State,
  getOpenOrders,
  getHistoryOrders,
  getOrdersLoading,
  getOpenOrdersCount,
  getUserInfo
} from '../../../core/reducers';
import {Subject, Observable} from 'rxjs';
import {SimpleCurrencyPair} from 'app/model/simple-currency-pair';
import {LoadOpenOrdersAction, LoadHistoryOrdersAction} from 'app/dashboard/actions/dashboard.actions';

@Component({
  selector: 'app-embedded-orders-mobile',
  templateUrl: './embedded-orders-mobile.component.html',
  styleUrls: ['./embedded-orders-mobile.component.scss']
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
  ) {
    this.store.pipe(select(getUserInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userInfo: ParsedToken) => {
        this.userInfo = userInfo;
      })
  }

  ngOnInit() {
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

  toggleMainTab(tabName: string): void {
    this.mainTab = tabName;
    this.mainTab === 'open' ?
      this.toOpenOrders() :
      this.toHistory();
  }

  toOpenOrders(): void {
    this.store.dispatch(new LoadOpenOrdersAction(this.activeCurrencyPair.id));
  }

  toHistory(): void {
    this.store.dispatch(new LoadHistoryOrdersAction(this.activeCurrencyPair.id));
  }

}
