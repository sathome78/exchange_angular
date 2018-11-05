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

  openOrders;

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

  changeItemsPerPage(e: MouseEvent) {
    const element: HTMLElement = <HTMLElement>e.currentTarget;

    this.countPerPage = parseInt(element.innerText, 10);
  }

  filterOpenOrders(page: number): void {
    this.currentPage = page;
  }

  onFromInputFieldChanged(event: IMyInputFieldChanged): void {
    this.dateFrom = new Date(event.value);
  }

  onToInputFieldChanged(event: IMyInputFieldChanged): void {
    this.dateTo = new Date(event.value);
  }

  initDate() {
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
