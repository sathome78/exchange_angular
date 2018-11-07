import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMyDpOptions, IMyInputFieldChanged } from 'mydatepicker';

import { Order } from '../../dashboard/trading/order.model';
import { OrdersService } from '../../dashboard/orders/orders.service';
import { MockDataService } from '../../services/mock-data.service';
import { TradingService } from '../../dashboard/trading/trading.service';
import { MarketService } from '../../dashboard/markets/market.service';
import { AuthService } from '../../services/auth.service';

import { timestamp, takeUntil } from 'rxjs/internal/operators';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/index';

@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss']
})
export class OpenOrdersComponent implements OnInit, OnDestroy {

  @ViewChild('dropdown')
  dropdownElement: ElementRef;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  refreshOrdersSubscription = new Subscription();

  showFilterPopup = false;

  public activeCurrencyPair;
  public arrPairName: string[];

  public openOrdersCount = 0;

  /** this id showing order id in popup window */
  orderId: number;
  selectedOrder;

  openOrders;
  countOfEntries: number;

  currentPage = 1;
  countPerPage = 14;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
  };

  public modelDateFrom: any;
  public modelDateTo: any;

  public dateFrom: Date;
  public dateTo: Date;

  constructor(
    private mockData: MockDataService,
    public tradingService: TradingService,
    private ordersService: OrdersService,
    private marketService: MarketService,
    private authService: AuthService
  ) { }

  ngOnInit() {

    /** start mock */
    // TODO: delete in prod
    // this.openOrders = this.mockData.getOpenOrders().items;
    // this.activeCurrencyPair = 'USD/BTC';
    // this.arrPairName = this.activeCurrencyPair.split('/');
    // this.countOfEntries = this.openOrders.length;
    /** end mock */
    /** get open orders data */
    this.marketService.setStompSubscription();
    this.marketService.activeCurrencyListener
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.activeCurrencyPair = res;
        this.toOpenOrders();
        this.splitPairName();
      });
    if (this.authService.isAuthenticated()) {
      this.ordersService.setFreshOpenOrdersSubscription(this.authService.getUsername());
      this.refreshOrdersSubscription = this.ordersService.personalOrderListener.subscribe(msg => {
        this.toOpenOrders();
      });
    }
    /** end get open orders data */

    this.initDate();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.ordersService.unsubscribeStomp();
    this.refreshOrdersSubscription.unsubscribe();
  }

  toggleDropdown(e: MouseEvent) {
    this.dropdownElement.nativeElement.classList.toggle('dropdown--open');
  }

  changeItemsPerPage(e: MouseEvent) {
    const element: HTMLElement = <HTMLElement>e.currentTarget;

    this.countPerPage = parseInt(element.innerText, 10);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  onFromInputFieldChanged(event: IMyInputFieldChanged): void {
    const date = new Date();
    this.dateFrom = new Date(date.setTime(Date.parse(this.formarDate(event.value))));
    // this.filterByDate();
  }

  onToInputFieldChanged(event: IMyInputFieldChanged): void {
    const date = new Date();
    this.dateTo = new Date(date.setTime(Date.parse(this.formarDate(event.value))));
    // this.filterByDate();
  }

    /**
   * format date string
   * @param { string } date m.d.y exmaple 09.25.2018;
   * @returns { string } returns string in format d.m.y: exmaple 25.09.2018
   */
  formarDate(date: string): string {
    const strArray: string[] = date.split('.');
    strArray.splice(0, 2, strArray[1], strArray[0]);
    return strArray.join('.');
  }

  /** filter openOrders by date */
  filterByDate(): void {
    // todo: delete for prod
    this.openOrders = this.mockData.getOpenOrders().items;

    if (this.dateFrom && this.dateTo) {
      const timestampFrom = this.dateFrom.getTime();
      const timestampTo = this.dateTo.getTime();

      if (timestampFrom && timestampTo) {
        this.openOrders = this.openOrders.filter((item) => {
          const currentTimestamp = new Date(item.dateCreation).getTime();
          const res = (currentTimestamp >= timestampFrom) && (currentTimestamp <= timestampTo);
          return res;
        });
        this.countOfEntries = this.openOrders.length;
      }
    }
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

  initDate(): void {
    /** Initialized to current date */
    const currentDate = new Date();

    this.modelDateTo = {
      date: {
        year: currentDate.getFullYear(),
        month: (currentDate.getMonth() !== 0) ? currentDate.getMonth() + 1 : 1,
        day: currentDate.getDate()
      }
    };

    /** get yesterday's date */
    const yesterdayTimestamp = currentDate.setDate(currentDate.getDate() - 1);
    const yesterdayDate = new Date(yesterdayTimestamp);

    this.modelDateFrom = {
      date: {
        year: yesterdayDate.getFullYear(),
        month: (yesterdayDate.getMonth() !== 0) ? yesterdayDate.getMonth() + 1 : 1,
        day: yesterdayDate.getDate()
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
   * request to get open-orders data
   */
  toOpenOrders(): void {
    const sub = this.ordersService.getOpenOrders(this.activeCurrencyPair.currencyPairId)
      .subscribe(data => {
        this.openOrders = data.items;
        this.openOrdersCount = data.count;
        sub.unsubscribe();
      }, (error) => console.log(error));
  }


  /** split pair name for show */
  private splitPairName(): void {
    this.arrPairName = this.activeCurrencyPair.currencyPairName.split('/');
  }

  /**
  * clsose cancel popup
  */
  closePopup(): void {
    const targetPopup: HTMLElement = document.getElementById('popup-' + this.orderId);
    console.log(targetPopup);
    if (targetPopup) {
      targetPopup.style.display = 'none';
    }

    this.orderId = null;
    this.selectedOrder = null;
  }

  /**
  * open cancel popup
  */
  openPopup(orderItem): void {
    this.orderId = orderItem.id;
    this.selectedOrder = orderItem;
    const targetPopup: HTMLElement = document.getElementById('popup-' + this.orderId);
    if (targetPopup) {
      targetPopup.style.display = 'block';
    }
  }

  /**
   * set status order canceled
   * @param order
   */
  cancelOrder(): void {
    if (this.selectedOrder) {
      const editedOrder = {
        orderId: this.selectedOrder.id,
        amount: this.selectedOrder.amountConvert,
        baseType: this.selectedOrder.orderBaseType,
        commission: this.selectedOrder.commissionValue,
        currencyPairId: this.selectedOrder.currencyPairId,
        orderType: this.selectedOrder.operationTypeEnum,
        rate: this.selectedOrder.exExchangeRate,
        total: this.selectedOrder.amountWithCommission,
        status: 'CANCELLED'
      };

      if (this.selectedOrder.stopRate) {
        editedOrder.rate = this.selectedOrder.stopRate;
      }
      console.log(editedOrder);
      this.ordersService.updateOrder(editedOrder).subscribe(res => {
        this.toOpenOrders();
      });
    }

   this.closePopup();
  }

  openFilterPopup() {
    this.showFilterPopup = true;
  }

  closeFilterPopup() {
    this.showFilterPopup = false;
  }
}
