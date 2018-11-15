import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import {IMyDpOptions, IMyInputFieldChanged} from 'mydatepicker';

import { MockDataService } from '../../services/mock-data.service';
import { TradingService } from '../../dashboard/components/trading/trading.service';
import { MarketService } from '../../dashboard/components/markets/market.service';
import { AuthService } from '../../services/auth.service';
import { OrdersService } from '../../dashboard/components/orders/orders.service';
import { CurrencyPair } from '../../model/currency-pair.model';

import { timestamp, takeUntil } from 'rxjs/internal/operators';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/index';
import { forkJoin} from 'rxjs';
@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss']
})
export class OrdersHistoryComponent implements OnInit, OnDestroy {

  @ViewChild('dropdown')
  dropdownElement: ElementRef;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  refreshOrdersSubscription = new Subscription();

  orderHistory;
  countOfEntries: number;
  filteredOrderHistory;

  currentPage = 1;
  countPerPage = 14;

  /** all currency pair */
  currencyPairs: CurrencyPair[] = [];
  /** filtered currency pair */
  pairs: CurrencyPair[] = [];

  showFilterPopup = false;
  public dateFrom: Date;
  public dateTo: Date;
  public modelDateFrom: any;
  public modelDateTo: any;

  currency: string;

  arrPairName: string[];
  activeCurrencyPair: CurrencyPair;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
  };

  public model: any = { date: { year: 2018, month: 10, day: 9 } };

  constructor(
    private mockData: MockDataService,
    public tradingService: TradingService,
    private ordersService: OrdersService,
    private marketService: MarketService,
    private authService: AuthService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {

    /** mock */
    // TODO: delete in prod
    // this.orderHistory = this.mockData.getOpenOrders().items;
    // this.activeCurrencyPair = 'USD/BTC';
    // this.arrPairName = this.activeCurrencyPair.split('/');
    // this.countOfEntries = this.orderHistory.length;
    /** end mock */

    // this.marketService.setStompSubscription();

    // this.currencyPairs = this.mockData.getMarketsData().map(item => CurrencyPair.fromJSON(item));
    /** get currencyPairs */
    this.marketService.marketListener$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(pairs => {
        this.currencyPairs = pairs;
        console.log('marketServices', this.currencyPairs);
        this.ref.detectChanges();
      });

    this.marketService.activeCurrencyListener
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.activeCurrencyPair = res;
        this.currency = this.activeCurrencyPair.currencyPairName;
        this.splitPairName();
        this.toHistory();
      });
    if (this.authService.isAuthenticated()) {
      this.ordersService.setFreshOpenOrdersSubscription(this.authService.getUsername());
      this.refreshOrdersSubscription = this.ordersService.personalOrderListener.subscribe(msg => {
      });
    }

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
    this.pairs = this.currencyPairs.filter(f => f.currencyPairName.toUpperCase().match(value.toUpperCase()));
  }

  /** filter by date */
  filterByDate(): void {
    if (this.dateFrom && this.dateTo) {
      const timestampFrom = this.dateFrom.getTime();
      const timestampTo = this.dateTo.getTime();

      if (timestampFrom && timestampTo && this.orderHistory) {
        this.filteredOrderHistory = this.orderHistory.filter((item) => {
          const currentTimestamp = new Date(item.dateCreation).getTime();
          const res = (currentTimestamp >= timestampFrom) && (currentTimestamp <= timestampTo);
          return res;
        });
        this.countOfEntries = this.filteredOrderHistory.length;
      }
    }
  }

  selctNewActiveCurrencyPair(pair: CurrencyPair) {
    this.activeCurrencyPair = pair;
    this.currency = pair.currencyPairName;
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

  /**
 * request to get history data with status (CLOSED and CANCELED)
 */
  toHistory(): void {
    if (this.activeCurrencyPair) {
      const forkSubscription = forkJoin(
        this.ordersService.getHistory(this.activeCurrencyPair.currencyPairId, 'CLOSED'),
        this.ordersService.getHistory(this.activeCurrencyPair.currencyPairId, 'CANCELLED')
      )
        .subscribe(([res1, res2]) => {
          this.orderHistory = [...res1.items, ...res2.items];
          this.filteredOrderHistory = this.orderHistory;
          this.countOfEntries = this.orderHistory.length;
          this.ref.detectChanges();
          forkSubscription.unsubscribe();
        });
    }
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

  /** split pair name for show */
  private splitPairName(): void {
    this.arrPairName = this.activeCurrencyPair.currencyPairName.split('/');
  }

  openFilterPopup() {
    this.showFilterPopup = true;
  }

  closeFilterPopup() {
    this.showFilterPopup = false;
  }
}
