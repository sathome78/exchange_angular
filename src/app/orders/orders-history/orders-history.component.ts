import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {IMyDpOptions, IMyDateModel, IMyDate} from 'mydatepicker';
import {Store, select} from '@ngrx/store';

import {OrderItem} from '../models/order-item.model';
import * as ordersReducer from '../store/reducers/orders.reducer';
import * as ordersAction from '../store/actions/orders.actions';
import {Observable, Subject} from 'rxjs';
import {OrderCurrencyPair} from '../models/order-currency-pair';
import {OrdersService} from '../orders.service';
import {takeUntil} from 'rxjs/operators';
import saveAs from 'file-saver';
import { UtilsService } from 'app/shared/services/utils.service';

@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss']
})
export class OrdersHistoryComponent implements OnInit, OnDestroy {

  @ViewChild('dropdown') dropdownElement: ElementRef;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public orderItems$: Observable<OrderItem[]>;
  public orderItems: OrderItem[] = [];
  public countOfEntries$: Observable<number>;
  public countOfEntries: number = 0;
  public currencyPairs$: Observable<OrderCurrencyPair[]>;

  public currentPage = 1;
  public countPerPage = 15;

  public modelDateFrom: any;
  public modelDateTo: any;
  public currencyPairId: string = null;
  public hideAllCanceled: boolean = false;
  public isMobile: boolean = false;

  public showFilterPopup = false;
  public tableScrollStyles: any = {};

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
    disableSince: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    }
  };

  constructor(
    private store: Store<ordersReducer.State>,
    private ordersService: OrdersService,
    private utils: UtilsService,
  ) {
    this.orderItems$ = store.pipe(select(ordersReducer.getHistoryOrdersFilterCurr));
    this.countOfEntries$ = store.pipe(select(ordersReducer.getHistoryOrdersCount));
    this.currencyPairs$ = store.pipe(select(ordersReducer.getAllCurrencyPairsSelector));

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
      this.countPerPage = 30;
    }
    this.initDate();
    this.store.dispatch(new ordersAction.LoadCurrencyPairsAction());
    this.loadOrders();
  }

  loadOrders() {
    if(this.isDateRangeValid()){
      const params = {
        page: this.currentPage,
        limit:this.countPerPage,
        dateFrom: this.formatDate(this.modelDateFrom.date),
        dateTo: this.formatDate(this.modelDateTo.date),
        hideCanceled: this.hideAllCanceled,
        currencyPairId: this.currencyPairId,
      }
      this.store.dispatch(new ordersAction.LoadHistoryOrdersAction(params));
    }
  }

  loadMoreOrders(): void {
    if(this.isDateRangeValid() && this.orderItems.length !== this.countOfEntries) {
      this.currentPage += 1;
      const params = {
        page: this.currentPage,
        limit:this.countPerPage,
        dateFrom: this.formatDate(this.modelDateFrom.date),
        dateTo: this.formatDate(this.modelDateTo.date),
        hideCanceled: this.hideAllCanceled,
        currencyPairId: this.currencyPairId,
        concat: true,
      }
      this.store.dispatch(new ordersAction.LoadHistoryOrdersAction(params));
    }
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

  toggleDropdown(e: MouseEvent) {
    this.dropdownElement.nativeElement.classList.toggle('dropdown--open');
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

  changeItemsPerPage(e: MouseEvent) {
    const element: HTMLElement = <HTMLElement>e.currentTarget;
    this.countPerPage = parseInt(element.innerText, 10);
    this.loadOrders();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadOrders();
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

  /**
   * sets class for order type field
   * @param {string} type ordert type: examples: 'buy', 'sell', 'stop'
   * @returns {string}
   */
  setClassForOrderTypeField (type: string): string {
    let className: string;
    if (type) {
      className = 'orders__type-' + type.toLocaleLowerCase();
    } else {
      className = '';
    }

    return className;
  }

  initDate() {
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

  openFilterPopup() {
    this.showFilterPopup = true;
  }

  closeFilterPopup() {
    if(this.isDateRangeValid()) {
      this.showFilterPopup = false;
      this.loadOrders();
    }
  }

  downloadExcel() {
    const params = {
      dateFrom: this.formatDate(this.modelDateFrom.date),
      dateTo: this.formatDate(this.modelDateTo.date),
      hideCanceled: this.hideAllCanceled,
      currencyPairId: this.currencyPairId,
    }
    this.ordersService.downloadExcel(params)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        const blob = new Blob([data], {type: 'text/ms-excel'});
        saveAs(blob, 'history-orders.xlsx');
      });
  }

  isFiat(currName: string, currIndex: number): boolean {
    const curr = currName.split('/');
    return this.utils.isFiat(curr[currIndex - 1]);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
