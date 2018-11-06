import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMyDpOptions, IMyInputFieldChanged } from 'mydatepicker';

import { Order } from '../../dashboard/trading/order.model';
import { OrdersService } from '../../dashboard/orders/orders.service';
import { MockDataService } from '../../services/mock-data.service';
import { TradingService } from '../../dashboard/trading/trading.service';
import { timestamp } from 'rxjs/internal/operators';
@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss']
})
export class OpenOrdersComponent implements OnInit {

  @ViewChild('dropdown')
  dropdownElement: ElementRef;

  openOrders;

  currentPage = 1;
  countPerPage = 14;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
  };

  public modelDateFrom: any;
  public modelDateTo: any;

  public dateFrom: Date;
  public dateTo: Date;

  public currentPair;
  public commissionIndex;
  public orderType = 'BUY';
  public order;
  public orderStop;
  public editOrderPopup = false;
  public limitsData = ['LIMIT', 'STOP_LIMIT', 'ICO'];
  public dropdownLimitValue = this.limitsData[0];

  // public defaultOrder: OpenOrders = new OpenOrders('', '', 0 , 0 , 0 , 0 , 0 , 0 , '');
  public defaultOrder: Order = {
    orderType: '',
    orderId: 0,
    currencyPairId: null,
    amount: null,
    rate: null,
    commission: 0,
    baseType: this.dropdownLimitValue,
    total: null,
    status: ''
  };

  constructor(
    private mockData: MockDataService,
    public tradingService: TradingService,
    private ordersService: OrdersService,
  ) { }

  ngOnInit() {
    this.openOrders = this.mockData.getOpenOrders().items;
    this.initDate();
  }

  toggleDropdown(e: MouseEvent) {
    this.dropdownElement.nativeElement.classList.toggle('dropdown--open');
  }

  changeItemsPerPage(e: MouseEvent) {
    const element: HTMLElement = <HTMLElement>e.currentTarget;

    this.countPerPage = parseInt(element.innerText, 10);
  }

  filterOpenOrders(page: number): void {
    this.currentPage = page;
  }

  onFromInputFieldChanged(event: IMyInputFieldChanged): void {
    const date = new Date();
    this.dateFrom = new Date(date.setTime(Date.parse(this.formarDate(event.value))));
    this.filterByDate();
  }

  onToInputFieldChanged(event: IMyInputFieldChanged): void {
    const date = new Date();
    this.dateTo = new Date(date.setTime(Date.parse(this.formarDate(event.value))));
    this.filterByDate();
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

    const timestampFrom = this.dateFrom.getTime();
    const timestampTo = this.dateTo.getTime();

    if (timestampFrom && timestampTo) {
      this.openOrders = this.openOrders.filter((item) => {
        const currentTimestamp = new Date(item.dateCreation).getTime();
        const res = (currentTimestamp > timestampFrom) && (currentTimestamp < timestampTo);
        return res;
      });
    }
  }

  toggleDetails(event: MouseEvent) {
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
 * show edit popup with selected order
 * @param order
 */
  showEditOrderPopup(order): void {
    this.editOrderPopup = true;

    if (order.orderBaseType === 'STOP_LIMIT') {
      this.orderStop = order.stopRate;
    }
    this.order.rate = order.amountWithCommission / order.amountConvert;
    this.order.amount = order.amountConvert;
    this.order.total = order.amountWithCommission;
    this.order.orderType = order.operationTypeEnum;
    this.order.orderId = order.id;
    this.order.currencyPairId = order.currencyPairId;
    this.dropdownLimitValue = order.orderBaseType;
    this.order.commission = order.commissionFixedAmount;
    this.getCommissionIndex();
    this.filterOpenOrders(this.currentPage);
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
  * clsose edit popup
  */
  closePopup(): void {
    this.editOrderPopup = false;
  }

  /**
   * on delete order
   * @param order
   */
  deleteOrder(order): void {
    // const foundOrder = this.setStatusOrder(order, 'DELETED');
    this.ordersService.deleteOrder(order).subscribe(res => {
      console.log(res);
    });
    this.filterOpenOrders(this.currentPage);
    this.editOrderPopup = false;
  }

  /**
   * create new order after set status CANCELED
   */
  createNewOrder(): void {
    this.order.orderId = 0;
    this.order.status = 'OPENED';

    this.ordersService.createOrder(this.order).subscribe(res => {
      this.order = { ...this.defaultOrder };
      this.orderStop = '';
      this.editOrderPopup = false;
      this.filterOpenOrders(this.currentPage);
    });

    // delete
    this.order = { ...this.defaultOrder };
    this.orderStop = '';
    this.editOrderPopup = false;
    this.filterOpenOrders(this.currentPage);
    //
  }

  /**
  * get commissionIndex from server
  */
  getCommissionIndex(): void {
    this.commissionIndex = 0.02;
    if (this.orderType && this.currentPair.currencyPairId) {
      const subscription = this.tradingService.getCommission(this.orderType, this.currentPair.currencyPairId).subscribe(res => {
        this.commissionIndex = res.commissionValue;
        subscription.unsubscribe();
      });
    }
  }
}
