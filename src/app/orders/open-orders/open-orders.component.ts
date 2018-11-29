import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy} from '@angular/core';
import { IMyDpOptions, IMyInputFieldChanged } from 'mydatepicker';

import {OrderItem} from '../order-item.model';
import {OrdersService} from '../orders.service';

@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenOrdersComponent implements OnInit {

  @ViewChild('dropdown')
  dropdownElement: ElementRef;

  public orderItems: OrderItem []  = [];
  public countOfEntries = 0;

  currentPage = 1;
  countPerPage = 14;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
  };

  public modelDateFrom: any;
  public modelDateTo: any;

  public dateFrom: Date;
  public dateTo: Date;

  constructor( private ordersService: OrdersService) { }

  ngOnInit() {

    this.ordersService.getOpenOrders()
      .subscribe(wrapper => {
        this.countOfEntries = wrapper.count;
        this.orderItems = wrapper.items;
        console.log(this.orderItems );
        console.log(this.countOfEntries );
      });

    this.initDate();
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

  /** tracks input changes in a my-date-picker component */
  onFromInputFieldChanged(event: IMyInputFieldChanged): void {
    const date = new Date();
    this.dateFrom = new Date(date.setTime(Date.parse(this.formarDate(event.value))));
    this.filterByDate();
  }

  /** tracks input changes in a my-date-picker component */
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

  filterByCurrency(value: string) {
    // this.pairs = this.currencyPairs.filter(f => f.currencyPairName.toUpperCase().match(value.toUpperCase()));
  }

  /** filter openOrders by date */
  filterByDate(): void {
    if (this.dateFrom && this.dateTo) {
      const timestampFrom = this.dateFrom.getTime();
      const timestampTo = this.dateTo.getTime();

      // if (timestampFrom && timestampTo && this.openOrders) {
      //   this.filteredOpenOrders = this.openOrders.filter((item) => {
      //     const currentTimestamp = new Date(item.dateCreation).getTime();
      //     const res = (currentTimestamp >= timestampFrom) && (currentTimestamp <= timestampTo);
      //     return res;
      //   });
      //   this.countOfEntries = this.filteredOpenOrders.length;
      //   this.ref.detectChanges();
      // }
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
    // this.showFilterPopup = true;
  }

  closeFilterPopup() {
    // this.showFilterPopup = false;
  }
}
