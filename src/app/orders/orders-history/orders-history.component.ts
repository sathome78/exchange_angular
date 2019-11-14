import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { IMyDpOptions, IMyDateModel, IMyDate } from 'mydatepicker';
import { Store, select } from '@ngrx/store';

import { OrderItem } from '../models/order-item.model';
import * as ordersReducer from '../store/reducers/orders.reducer';
import * as ordersAction from '../store/actions/orders.actions';
import * as coreAction from '../../core/actions/core.actions';
import * as mainSelectors from '../../core/reducers';
import { Observable, Subject } from 'rxjs';
import { OrdersService } from '../orders.service';
import { takeUntil } from 'rxjs/operators';
import fileSaver from 'file-saver';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { BreakpointService } from 'app/shared/services/breakpoint.service';
import * as moment from 'moment';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss'],
})
export class OrdersHistoryComponent implements OnInit, OnDestroy {

  public startAnimation = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public orderItems$: Observable<OrderItem[]>;
  public orderItems: OrderItem[] = [];
  public countOfEntries$: Observable<number>;
  public countOfEntries = 0;
  public currencyPairs$: Observable<SimpleCurrencyPair[]>;
  public loading$: Observable<boolean>;
  public isLast15Items$: Observable<boolean>;

  public currentPage = 1;
  public countPerPage = 15;

  public modelDateFrom: any;
  public modelDateTo: any;
  public currencyPairId: string = null;
  public currencyPairValue = '';
  public hideAllCanceled = false;
  public isMobile = false;
  public loadingExcel = false;
  public userInfo: ParsedToken;

  public showFilterPopup = false;
  public tableScrollStyles: any = {};

  public isDateInputFromFocus = false;
  public isDateInputToFocus = false;

  public myDatePickerOptions: IMyDpOptions = {
    showInputField: false,
    dateFormat: 'dd.mm.yyyy',
    disableSince: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate() + 1,
    },
  };

  constructor(
    private store: Store<mainSelectors.State>,
    private ordersService: OrdersService,
    public breakpointService: BreakpointService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService
  ) {
    this.orderItems$ = store.pipe(select(ordersReducer.getHistoryOrdersFilterCurr));
    this.countOfEntries$ = store.pipe(select(ordersReducer.getHistoryOrdersCount));

    this.currencyPairs$ = store.pipe(select(mainSelectors.getSimpleCurrencyPairsSelector));
    this.loading$ = store.pipe(select(ordersReducer.getLoadingSelector));

    const componentHeight = window.innerHeight;
    this.tableScrollStyles = {
      height: componentHeight - 112 + 'px',
      overflow: 'scroll',
    };
    this.orderItems$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(items => (this.orderItems = items));
    this.countOfEntries$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(items => (this.countOfEntries = items));

    this.store
      .pipe(select(mainSelectors.getUserInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userInfo: ParsedToken) => {
        this.userInfo = userInfo;
      });
  }

  ngOnInit() {
    setTimeout(() => {
      this.startAnimation = true;
    }, 600);

    this.isMobile = window.innerWidth < 1200;
    if (this.isMobile) {
      this.countPerPage = 30;
    }
    // this.initDate();
    this.store.dispatch(new coreAction.LoadCurrencyPairsAction());
    this.loadOrders();
  }

  public get isVipUser() {
    if (this.userInfo) {
      return this.userInfo.userRole === 'VIP_USER';
    }
    return false;
  }

  loadOrders() {
    const params = {
      page: this.currentPage,
      limit: 0,
      dateFrom: this.modelDateFrom ? this.formatDate(this.modelDateFrom.date) : null,
      dateTo: this.modelDateTo ? this.formatDate(this.modelDateTo.date) : null,
      hideCanceled: this.hideAllCanceled,
      currencyPairId: this.currencyPairId || 0,
      currencyPairName: this.currencyPairValue || '',
    };
    this.store.dispatch(new ordersAction.LoadHistoryOrdersAction(params));
  }

  loadLastOrders() {
    this.clearFilters();
    const params = {
      page: this.currentPage,
      limit: this.countPerPage,
    };
    this.store.dispatch(new ordersAction.LoadLastHistoryOrdersAction(params));
    this.orderItems$.subscribe(res => {});
  }

  loadMoreOrders(): void {
    if (this.orderItems.length !== this.countOfEntries) {
      this.currentPage += 1;
      const params = {
        page: this.currentPage,
        limit: this.countPerPage,
        dateFrom: this.modelDateFrom ? this.formatDate(this.modelDateFrom.date) : null,
        dateTo: this.modelDateTo ? this.formatDate(this.modelDateTo.date) : null,
        hideCanceled: this.hideAllCanceled,
        currencyPairId: this.currencyPairId || 0,
        currencyPairName: this.currencyPairValue || '',
        concat: true,
      };
      this.store.dispatch(new ordersAction.LoadHistoryOrdersAction(params));
    }
  }

  clearFilters() {
    this.modelDateTo = null;
    this.modelDateFrom = null;
    this.currencyPairId = null;
    this.currencyPairValue = null;
  }

  /**
   * filter history orders by clicking on Filter button
   */
  onFilterOrders() {
    this.currentPage = 1;
    this.loadOrders();
  }

  /**
   * filter history orders with include or exclude CANCELED orders
   */
  onHideAllCanceled() {
    this.loadOrders();
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

  focusOrBlurDateFrom(event) {
    this.isDateInputFromFocus = event;
    this.cdr.detectChanges();
  }

  focusOrBlurDateTo(event) {
    this.isDateInputToFocus = event;
    this.cdr.detectChanges();
  }

  changeItemsPerPage(items: number) {
    this.countPerPage = items;
    this.loadOrders();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }

  /** tracks input changes in a my-date-picker component */
  dateFromChanged(event: IMyDateModel): void {
    this.modelDateFrom = { date: event.date };
    if (!this.isDateRangeValid() && !(event.date.year === 0 && event.date.day === 0)) {
      this.modelDateTo = { date: event.date };
    }
  }
  /** tracks input changes in a my-date-picker component */
  dateToChanged(event: IMyDateModel): void {
    this.modelDateTo = { date: event.date };
    if (!this.isDateRangeValid() && !(event.date.year === 0 && event.date.day === 0)) {
      this.modelDateFrom = { date: event.date };
    }
  }

  /**
   * check is date To is bigger than date From
   * @returns { boolean }
   */
  isDateRangeValid(): boolean {
    if (
      !this.modelDateFrom ||
      !this.modelDateFrom.date ||
      !this.modelDateTo ||
      !this.modelDateTo.date
    ) {
      return false;
    }
    const dateFrom = new Date(
      this.modelDateFrom.date.year,
      this.modelDateFrom.date.month - 1,
      this.modelDateFrom.date.day
    );
    const dateTo = new Date(
      this.modelDateTo.date.year,
      this.modelDateTo.date.month - 1,
      this.modelDateTo.date.day
    );
    const diff = dateTo.getTime() - dateFrom.getTime();
    return diff >= 0;
  }

  /**
   * format date string
   * @param { IMyDate } date
   * @returns { string } returns string in format yyyy-mm-dd: example 2018-09-28
   */
  formatDate(date: IMyDate): string {
    if (!date || (date.year === 0 && date.day === 0)) {
      return null;
    }
    return moment([date.year, date.month - 1, date.day]).format();
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

  clearModelDateTo() {
    this.modelDateTo = null;
  }

  clearModelDateFrom() {
    this.modelDateFrom = null;
  }

  // initDate() {
  //   /** Initialized to current date */
  //   const currentDate = new Date();

  //   this.modelDateTo = {
  //     date: {
  //       year: currentDate.getFullYear(),
  //       month: currentDate.getMonth() + 1,
  //       day: currentDate.getDate()
  //     }
  //   };

  //   this.modelDateFrom = {
  //     date: {
  //       year: currentDate.getFullYear(),
  //       month: currentDate.getMonth() + 1,
  //       day: currentDate.getDate()
  //     }
  //   };
  // }

  openFilterPopup() {
    this.showFilterPopup = true;
  }

  closeFilterPopup() {
    this.showFilterPopup = false;
  }

  filterPopupSubmit() {
    this.currentPage = 1;
    this.closeFilterPopup();
    this.loadOrders();
  }

  downloadExcel() {
    const params = {
      dateFrom: this.modelDateFrom ? this.formatDate(this.modelDateFrom.date) : null,
      dateTo: this.modelDateTo ? this.formatDate(this.modelDateTo.date) : null,
      hideCanceled: this.hideAllCanceled,
      currencyPairId: this.currencyPairId || 0,
      currencyPairName: this.currencyPairValue || '',
    };
    this.loadingExcel = true;
    this.ordersService
      .downloadExcel(params)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        data => {
          const blob = new Blob([data], { type: 'text/ms-excel' });
          fileSaver(blob, 'history-orders.xlsx');
          this.loadingExcel = false;
        },
        err => {
          console.error(err);
          this.loadingExcel = false;
        }
      );
  }

  onChangeCurrPair(val: string): void {
    this.currencyPairValue = val;
    this.currencyPairId = null;
  }

  onSelectPair({ id }): void {
    this.currencyPairId = id;
    this.onFilterOrders();
  }

  currency(currName: string, currIndex: number): string {
    const curr = currName.split('/');
    return curr[currIndex - 1];
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  trackByOrders(index, item) {
    return item.id;
  }

  isMarketOrder(operationType: string): boolean {
    return operationType === 'BUY MARKET' || operationType === 'SELL MARKET';
  }
  isStopOrder(operationType: string): boolean {
    return operationType === 'BUY STOP_LIMIT' || operationType === 'SELL STOP_LIMIT';
  }

}
