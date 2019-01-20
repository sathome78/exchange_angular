import {Component, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {IMyDpOptions, IMyDate, IMyDateModel} from 'mydatepicker';
import {Store, select} from '@ngrx/store';

import {OrderItem} from '../models/order-item.model';
import * as ordersReducer from '../store/reducers/orders.reducer';
import * as ordersAction from '../store/actions/orders.actions';
import * as coreAction from '../../core/actions/core.actions';
import * as fromCore from '../../core/reducers';
import {State} from '../../core/reducers';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {UtilsService} from 'app/shared/services/utils.service';
import {SimpleCurrencyPair} from 'app/core/models/simple-currency-pair';
import { CurrencyChoose } from 'app/core/models/currency-choose.model';

@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenOrdersComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public orderItems$: Observable<OrderItem[]>;
  public orderItems: OrderItem[] = [];
  public countOfEntries$: Observable<number>;
  public countOfEntries: number = 0;
  public currencyPairs$: Observable<SimpleCurrencyPair[]>;
  public allCurrenciesForChoose$: Observable<CurrencyChoose[]>;
  public loading$: Observable<boolean>;
  public currentPage = 1;
  public countPerPage = 15;
  public isMobile: boolean = false;
  public showCancelOrderConfirm: number | null = null;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
    disableSince: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    }
  };

  public modelDateFrom: any;
  public modelDateTo: any;
  public currencyPairId: string = null;
  public currencyPairValue: string = '';
  public currValue: string = '';

  public showFilterPopup: boolean = false;
  public tableScrollStyles: any = {};

  constructor(
    private store: Store<State>,
    private utils: UtilsService,
  ) {
    this.orderItems$ = store.pipe(select(ordersReducer.getOpenOrdersFilterCurr));
    this.countOfEntries$ = store.pipe(select(ordersReducer.getOpenOrdersCount));
    this.currencyPairs$ = store.pipe(select(fromCore.getSimpleCurrencyPairsSelector));
    this.loading$ = store.pipe(select(ordersReducer.getLoadingSelector));
    this.allCurrenciesForChoose$ = store.pipe(select(fromCore.getAllCurrenciesForChoose));

    const componentHeight = window.innerHeight;
    this.tableScrollStyles = {'height': (componentHeight - 112) + 'px', 'overflow': 'scroll'}
    this.orderItems$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((items) => this.orderItems = items)
    this.countOfEntries$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((items) => this.countOfEntries = items)
  }

  ngOnInit() {
    this.isMobile = window.innerWidth < 1200;
    if(this.isMobile) {
      this.countPerPage = 10;
    }
    this.initDate();
    this.store.dispatch(new coreAction.LoadCurrencyPairsAction());
    this.store.dispatch(new coreAction.LoadAllCurrenciesForChoose());
    this.loadOrders();
  }

  /**
   * dispatching action to load the list of the open orders
   */
  loadOrders(): void {
    if(this.isDateRangeValid()) {
      const params = {
        page: this.currentPage,
        limit:this.countPerPage,
        dateFrom: this.formatDate(this.modelDateFrom.date),
        dateTo: this.formatDate(this.modelDateTo.date),
        currencyPairId: this.currencyPairId,
      }
      this.store.dispatch(new ordersAction.LoadOpenOrdersAction(params));
    }
  }
  loadMoreOrders(): void {
    if(this.isDateRangeValid() && this.orderItems.length !== this.countOfEntries) {
      this.currentPage += 1;
      const params = {
        page: this.currentPage,
        limit:this.countPerPage,
        // dateFrom: this.formatDate(this.modelDateFrom.date),
        // dateTo: this.formatDate(this.modelDateTo.date),
        currencyPairId: this.currencyPairId,
        concat: true,
      }
      this.store.dispatch(new ordersAction.LoadOpenOrdersAction(params));
    }
  }


  changeItemsPerPage(items: number) {
    this.countPerPage = items;
    this.loadOrders();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }

   /**
   * filter history orders by clicking on Filter button
   */
  onFilterOrders() {
    if(this.isDateRangeValid()) {
      this.currentPage = 1;
      this.loadOrders();
    }
  }

  /** tracks input changes in a my-date-picker component */
  dateFromChanged(event: IMyDateModel): void {
    this.modelDateFrom = {date: event.date};
    if (!this.isDateRangeValid() && !(event.date.year === 0 && event.date.day === 0)) {
      this.modelDateTo = {date: event.date};
    }
  }
  /** tracks input changes in a my-date-picker component */
  dateToChanged(event: IMyDateModel): void {
    this.modelDateTo = {date: event.date};
    if (!this.isDateRangeValid() && !(event.date.year === 0 && event.date.day === 0)) {
      this.modelDateFrom = {date: event.date};
    }
  }

  /**
   * check is date To is bigger than date From
   * @returns { boolean }
   */
  isDateRangeValid(): boolean {
    if(!this.modelDateFrom || !this.modelDateFrom.date || !this.modelDateTo || !this.modelDateTo.date) {
      return false;
    }
    const dateFrom = new Date(this.modelDateFrom.date.year, this.modelDateFrom.date.month - 1, this.modelDateFrom.date.day);
    const dateTo = new Date(this.modelDateTo.date.year, this.modelDateTo.date.month - 1, this.modelDateTo.date.day);
    const diff = dateTo.getTime() - dateFrom.getTime();
    return diff >= 0;
  }

  /**
   * format date string
   * @param { IMyDate } date
   * @returns { string } returns string in format yyyy-mm-dd: example 2018-09-28
   */
  formatDate(date: IMyDate): string {
    if(date.year === 0 && date.day === 0) {
      return null;
    }
    const day = date.day < 10 ? '0' + date.day : date.day;
    const month = date.month < 10 ? '0' + date.month : date.month;
    return `${date.year}-${month}-${day}`
  }

  // filterByCurrency(value: string) {
  //   this.orderItems$ = this.store.pipe(select(ordersReducer.getOpenOrdersFilterCurr, {currency: value}));
  // }

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

  initDate(): void {
    /** Initialized to current date */
    const currentDate = new Date();

    this.modelDateTo = {
      date: {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: currentDate.getDate()
      }
    };

    /** get yesterday's date */
    const dateFromTimestamp = currentDate.setDate(currentDate.getDate() - 1);
    const dateFrom = new Date(dateFromTimestamp);

    this.modelDateFrom = {
      date: {
        year: dateFrom.getFullYear(),
        month: dateFrom.getMonth() + 1,
        day: dateFrom.getDate()
      }
    };
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
    const params = {
      order,
      loadOrders: {
        page: this.currentPage,
        limit:this.countPerPage,
        dateFrom: this.formatDate(this.modelDateFrom.date),
        dateTo: this.formatDate(this.modelDateTo.date),
        currencyPairId: this.currencyPairId,
        isMobile: this.isMobile,
      }
    }

    this.store.dispatch(new ordersAction.CancelOrderAction(params));
    this.showCancelOrderConfirm = null;
  }

  openFilterPopup() {
    this.showFilterPopup = true;
  }

  closeFilterPopup() {
    if(this.isDateRangeValid()) {
      this.showFilterPopup = false;
      this.loadOrders();
    }
  }

  onShowCancelOrderConfirm(orderId: number | null): void {
    this.showCancelOrderConfirm = orderId;
  }

  isFiat(currName: string, currIndex: number): boolean {
    const curr = currName.split('/');
    return this.utils.isFiat(curr[currIndex - 1]);
  }

  onChangeCurrPair(val: string): void {
    this.currencyPairValue = val;
  }

  onSelectPair(currId: string): void {
    this.currencyPairId = currId;
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
