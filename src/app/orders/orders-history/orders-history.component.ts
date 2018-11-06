import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {IMyDpOptions, IMyInputFieldChanged} from 'mydatepicker';

@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss']
})
export class OrdersHistoryComponent implements OnInit {

  @ViewChild('dropdown')
  dropdownElement: ElementRef;

  orderHistory;

  currentPage = 1;
  countPerPage = 14;

  public modelDateFrom: any;
  public modelDateTo: any;


  public dateFrom: Date;
  public dateTo: Date;

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
  };

  public model: any = { date: { year: 2018, month: 10, day: 9 } };

  constructor() { }

  ngOnInit() {
    this.initDate();
  }

  toggleDropdown(e: MouseEvent) {
    this.dropdownElement.nativeElement.classList.toggle('dropdown--open');
  }

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
  }

  changePage(page: number): void {
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

  /** filter by date */
  filterByDate(): void {

    if (this.dateFrom && this.dateTo) {
      const timestampFrom = this.dateFrom.getTime();
      const timestampTo = this.dateTo.getTime();

      if (timestampFrom && timestampTo) {

      }
    }
  }

  initDate() {
    /** Initialized to current date */
    const currentDate = new Date();

    const mock = [
      {
        'id': 1203034,
        'date': new Date,
        'currencyPairName': 'BTC/ETH',
        'operationTypeEnum': 'Buy',
        'exrate': '4500',
        'amountConvert': '0.005',
        'commissionAmountForAcceptor': '30',
        'amountWithCommissionForAcceptor': '0,00005303869'
      }
    ];

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
}

// {
//   'date': Date(),
//   'dateTimestamp': 486846359, // number
//   'currencyPairName': 'BTC/ETH',
//   'orderType': 'sell',
//   'orderBaseType': 'STOP_LIMIT',  // values: LIMIT, STOP_LIMIT, ICO
//   'exrate:' 0.001219, //number
//   'amountConvert': 0.04351, //number/string
//   'commissionAmountForAcceptor': 0.02 //number/string
//   'amountWithCommissionForAcceptor': '6015', //number /string
// }
