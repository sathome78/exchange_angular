import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { OrderItem } from '../models/order-item.model';
import * as ordersReducer from '../store/reducers/orders.reducer';
import * as ordersAction from '../store/actions/orders.actions';
import * as coreAction from '../../core/actions/core.actions';
import * as fromCore from '../../core/reducers';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { CurrencyChoose } from 'app/model/currency-choose.model';
import { OrdersService } from '../orders.service';
import { BreakpointService } from 'app/shared/services/breakpoint.service';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenOrdersComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public startAnimation = false;

  public orderItems$: Observable<OrderItem[]>;
  public orderItems: OrderItem[] = [];
  public countOfEntries$: Observable<number>;
  public countOfEntries = 0;
  public currencyPairs$: Observable<SimpleCurrencyPair[]>;
  public allCurrenciesForChoose$: Observable<CurrencyChoose[]>;
  public loading$: Observable<boolean>;
  public currentPage = 1;
  public countPerPage = 15;
  public isMobile = false;
  public showCancelOrderConfirm: number | null = null;
  public isShowCancelAllOrdersConfirm = false;
  public activeCurrencyPair: SimpleCurrencyPair;

  public currencyPairId: string = null;
  public currencyPairValue = '';
  public currValue = '';

  public showFilterPopup = false;
  public tableScrollStyles: any = {};

  constructor(
    private store: Store<fromCore.State>,
    private ordersService: OrdersService,
    public breakpointService: BreakpointService,
    private userService: UserService
  ) {
    this.orderItems$ = store.pipe(select(ordersReducer.getOpenOrdersFilterCurr));
    this.countOfEntries$ = store.pipe(select(ordersReducer.getOpenOrdersCount));
    this.currencyPairs$ = store.pipe(select(fromCore.getSimpleCurrencyPairsSelector));
    this.loading$ = store.pipe(select(ordersReducer.getLoadingSelector));
    this.allCurrenciesForChoose$ = store.pipe(select(fromCore.getAllCurrenciesForChoose));
    store
      .pipe(select(fromCore.getActiveCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((activePair: SimpleCurrencyPair) => {
        this.activeCurrencyPair = activePair;
      });

    const componentHeight = window.innerHeight;
    this.tableScrollStyles = {
      height: componentHeight - 112 + 'px',
      overflow: 'scroll',
    };
    this.orderItems$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(items => (this.orderItems = items));
    this.countOfEntries$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(items => (this.countOfEntries = items));
  }

  ngOnInit() {
    setTimeout(()=>{
      this.startAnimation = true;
    },1000)


    this.isMobile = window.innerWidth < 1200;
    if (this.isMobile) {
      this.countPerPage = 10;
    }
    this.store.dispatch(new coreAction.LoadCurrencyPairsAction());
    this.store.dispatch(new coreAction.LoadAllCurrenciesForChoose());
    this.loadOrders();
  }

  /**
   * dispatching action to load the list of the open orders
   */
  loadOrders(isMobile: boolean = false): void {
    const params = {
      page: isMobile ? 1 : this.currentPage,
      limit: 0,
      currencyPairId: this.currencyPairId || 0,
    };
    this.store.dispatch(new ordersAction.LoadOpenOrdersAction(params));
  }
  loadMoreOrders(): void {
    if (this.orderItems.length !== this.countOfEntries) {
      this.currentPage += 1;
      const params = {
        page: this.currentPage,
        limit: 0,
        currencyPairId: this.currencyPairId || 0,
        concat: true,
      };
      this.store.dispatch(new ordersAction.LoadOpenOrdersAction(params));
    }
  }

  changeItemsPerPage(items: number) {
    this.countPerPage = items;
    this.loadOrders();
  }

  changePage(page: number): void {
    this.showCancelOrderConfirm = null;
    this.currentPage = page;
    this.loadOrders();
  }

  /**
   * filter history orders by clicking on Filter button
   */
  onFilterOrders() {
    this.currentPage = 1;
    this.loadOrders();
  }

  cancelAllOrders() {
    this.isShowCancelAllOrdersConfirm = false;
    this.ordersService
      .cancelAllOrders(this.currencyPairValue)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.currentPage = 1;
        this.loadOrders();
        this.userService.getUserBalance(this.activeCurrencyPair);
      });
  }

  toggleShowCancelAllOrdersConfirm() {
    this.isShowCancelAllOrdersConfirm = !this.isShowCancelAllOrdersConfirm;
  }

  /**
   * open submenu in the mobile version of the table
   * @param event
   */
  toggleDetails(event: MouseEvent): void {
    const element: HTMLElement = <HTMLElement>event.currentTarget;
    const idDetails = element.dataset.id;
    if (idDetails) {
      const detailsElement = document.getElementById(idDetails + '');
      if (detailsElement) {
        detailsElement.classList.toggle('table__details-show');
      }
    }
  }

  /**
   * sets class for order type field
   * @param {string} type ordert type: examples: 'buy', 'sell', 'stop'
   * @returns {string}
   */
  setClassForOrderTypeField(type: string): string {
    let className: string;
    if (type) {
      className = 'orders__type-' + type.toLocaleLowerCase();
    } else {
      className = '';
    }

    return className;
  }

  /**
   * set status order canceled
   * @param order
   */
  cancelOrder(order): void {
    if (!this.isMobile) {
      this.currentPage =
        (this.currentPage === 1 || this.orderItems.length - 1 - (this.currentPage - 1) * this.countPerPage) > 0
          ? this.currentPage
          : this.currentPage - 1;
    }
    const params = {
      order,
      loadOrders: {
        page: this.currentPage,
        limit: 0,
        currencyPairId: this.currencyPairId || 0,
        isMobile: this.isMobile,
      },
    };

    this.store.dispatch(new ordersAction.CancelOrderAction(params));
    this.showCancelOrderConfirm = null;
  }

  openFilterPopup() {
    this.showFilterPopup = true;
  }

  closeFilterPopup() {
    this.showFilterPopup = false;
  }

  onShowCancelOrderConfirm(orderId: number | null): void {
    this.showCancelOrderConfirm = orderId;
  }

  currency(currName: string, currIndex: number): string {
    const curr = currName.split('/');
    return curr[currIndex - 1];
  }

  onChangeCurrPair(val: string): void {
    this.currValue = val;
    this.currencyPairValue = val;
  }

  onSelectPair(currId: string, isMobile: boolean = false): void {
    this.currencyPairId = currId;
    this.loadOrders(isMobile);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  trackByOrders(index, item) {
    return item.id;
  }
}
