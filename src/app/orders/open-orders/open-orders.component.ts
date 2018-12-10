import {Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy} from '@angular/core';
import {IMyDpOptions, IMyDate, IMyDateModel} from 'mydatepicker';
import {Store, select} from '@ngrx/store';

import {OrderItem} from '../models/order-item.model';
import * as ordersReducer from '../store/reducers/orders.reducer';
import * as ordersAction from '../store/actions/orders.actions';
import {Observable} from 'rxjs';
import { OrderCurrencyPair } from '../models/order-currency-pair';

@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenOrdersComponent implements OnInit {

  @ViewChild('dropdown') dropdownElement: ElementRef;

  public orderItems$: Observable<OrderItem[]>;
  public countOfEntries$: Observable<number>;
  public currencyPairs$: Observable<OrderCurrencyPair[]>;
  public currentPage = 1;
  public countPerPage = 15;

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

  public currency: string = '';
  public showFilterPopup: boolean = false;

  constructor(
    private store: Store<ordersReducer.State>
  ) { 
    this.orderItems$ = store.pipe(select(ordersReducer.getOpenOrdersFilterCurr));
    this.countOfEntries$ = store.pipe(select(ordersReducer.getOpenOrdersCount));
    this.currencyPairs$ = store.pipe(select(ordersReducer.getAllCurrencyPairsSelector));
  }

  ngOnInit() {
    this.initDate();
    this.store.dispatch(new ordersAction.LoadCurrencyPairsAction());
    this.loadOrders();
  }

  /**
   * dispatching action to load the list of the open orders
   */
  loadOrders() {
    const params = {
      page: this.currentPage, 
      limit:this.countPerPage,
      from: this.formatDate(this.modelDateFrom.date),
      to: this.formatDate(this.modelDateTo.date),
      currencyPairId: this.currencyPairId,
    }
    this.store.dispatch(new ordersAction.LoadOpenOrdersAction(params));
  }

  toggleDropdown() {
    this.dropdownElement.nativeElement.classList.toggle('dropdown--open');
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
    return `${date.year}-${date.month}-${date.day}`
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
  // cancelOrder(): void {
  //   if (this.selectedOrder) {
  //     const editedOrder = {
  //       orderId: this.selectedOrder.id,
  //       amount: this.selectedOrder.amountConvert,
  //       baseType: this.selectedOrder.orderBaseType,
  //       commission: this.selectedOrder.commissionValue,
  //       currencyPairId: this.selectedOrder.currencyPairId,
  //       orderType: this.selectedOrder.operationTypeEnum,
  //       rate: this.selectedOrder.exExchangeRate,
  //       total: this.selectedOrder.amountWithCommission,
  //       status: 'CANCELLED'
  //     };
  //
  //     if (this.selectedOrder.stopRate) {
  //       editedOrder.rate = this.selectedOrder.stopRate;
  //     }
  //     console.log(editedOrder);
  //     this.ordersService.updateOrder(editedOrder).subscribe(res => {
  //       this.toOpenOrders();
  //     });
  //   }
  //
  //  this.closePopup();
  // }

  openFilterPopup() {
    this.showFilterPopup = true;
  }

  closeFilterPopup() {
    this.onFilterOrders()
    this.showFilterPopup = false;
  }
}
