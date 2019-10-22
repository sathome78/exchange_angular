import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IMyDpOptions, IMyDateModel, IMyDate } from 'mydatepicker';
import { Store, select } from '@ngrx/store';
import * as fundsReducer from '../store/reducers/funds.reducer';
import * as fundsAction from '../store/actions/funds.actions';
import * as coreAction from '../../core/actions/core.actions';
import * as mainSelectors from '../../core/reducers';
import { TransactionsService } from '../services/transaction.service';
import { UtilsService } from 'app/shared/services/utils.service';
import { TransactionHistoryItem } from '../models/transactions-history-item.model';
import { takeUntil } from 'rxjs/operators';
import fileSaver from 'file-saver';
import { CurrencyChoose } from 'app/model/currency-choose.model';
import { ConstantsService } from 'app/shared/services/constants.service';
import { BreakpointService } from 'app/shared/services/breakpoint.service';
import * as moment from 'moment';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent implements OnInit, OnDestroy {

  public startAnimation = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public transactionsItems$: Observable<TransactionHistoryItem[]>;
  public transactionsItems: TransactionHistoryItem[] = [];
  public countOfEntries$: Observable<number>;
  public countOfEntries = 0;
  public currencyForChoose$: Observable<CurrencyChoose[]>;
  public loading$: Observable<boolean>;
  public loadingExcel = false;
  public currValue = '';

  public currentPage = 1;
  public countPerPage = 15;

  public modelDateFrom: any;
  public modelDateTo: any;
  public currencyId: string = null;
  public hideAllCanceled = false;
  public isMobile = false;

  public showFilterPopup = false;
  public tableScrollStyles: any = {};
  public openDetails: number = null;
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
    private transactionsService: TransactionsService,
    public constantsService: ConstantsService,
    public breakpointService: BreakpointService,
    private cdr: ChangeDetectorRef,
    private utils: UtilsService
  ) {
    this.transactionsItems$ = store.pipe(select(fundsReducer.getTrHistorySelector));
    this.countOfEntries$ = store.pipe(select(fundsReducer.getCountTrHistorySelector));
    this.currencyForChoose$ = store.pipe(select(mainSelectors.getAllCurrenciesForChoose));
    this.loading$ = store.pipe(select(fundsReducer.getLoadingSelector));

    const componentHeight = window.innerHeight;
    this.tableScrollStyles = {
      height: componentHeight - 112 + 'px',
      overflow: 'scroll',
    };
    this.transactionsItems$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(items => (this.transactionsItems = items));
    this.countOfEntries$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(items => (this.countOfEntries = items));
  }

  ngOnInit() {

    setTimeout(()=>{
      this.startAnimation = true;
    },1000)



    // this.initDate();
    this.store.dispatch(new coreAction.LoadAllCurrenciesForChoose());
    this.loadLastTransactions();
  }

  loadTransactions() {
    const params = {
      offset: (this.currentPage - 1) * this.countPerPage,
      limit: this.countPerPage,
      dateFrom: this.modelDateFrom ? this.formatDate(this.modelDateFrom.date) : null,
      dateTo: this.modelDateTo ? this.formatDate(this.modelDateTo.date) : null,
      currencyId: this.currencyId || 0,
      currencyName: this.currValue || '',
    };
    this.store.dispatch(new fundsAction.LoadTransactionsHistoryAction(params));
  }

  clearFilters() {
    this.modelDateTo = null;
    this.modelDateFrom = null;
    this.currencyId = null;
    this.currValue = null;
  }

  loadLastTransactions() {
    this.clearFilters();
    const params = {
      offset: 0,
      limit: this.countPerPage,
    };
    this.store.dispatch(new fundsAction.LoadLastTransactionsHistoryAction(params));
  }

  loadMoreTransactions(): void {
    if (this.transactionsItems.length !== this.countOfEntries) {
      this.currentPage += 1;
      const params = {
        offset: (this.currentPage - 1) * this.countPerPage,
        limit: this.countPerPage,
        dateFrom: this.modelDateFrom ? this.formatDate(this.modelDateFrom.date) : null,
        dateTo: this.modelDateTo ? this.formatDate(this.modelDateTo.date) : null,
        currencyId: this.currencyId || 0,
        currencyName: this.currValue || '',
        concat: true,
      };
      this.store.dispatch(new fundsAction.LoadTransactionsHistoryAction(params));
    }
  }

  /**
   * filter history orders by clicking on Filter button
   */
  onFilter() {
    this.currentPage = 1;
    this.loadTransactions();
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

  changeItemsPerPage(items: number) {
    this.countPerPage = items;
    this.loadTransactions();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadTransactions();
  }

  clearModelDateTo() {
    this.modelDateTo = null;
  }

  clearModelDateFrom() {
    this.modelDateFrom = null;
  }

  focusOrBlurDateFrom(event) {
    this.isDateInputFromFocus = event;
    this.cdr.detectChanges();
  }

  focusOrBlurDateTo(event) {
    this.isDateInputToFocus = event;
    this.cdr.detectChanges();
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
    if (!this.modelDateFrom || !this.modelDateFrom.date || !this.modelDateTo || !this.modelDateTo.date) {
      return false;
    }
    const dateFrom = new Date(
      this.modelDateFrom.date.year,
      this.modelDateFrom.date.month - 1,
      this.modelDateFrom.date.day
    );
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
    if (!date || (date.year === 0 && date.day === 0)) {
      return null;
    }
    return moment([date.year, date.month - 1, date.day]).format();
  }

  downloadExcel() {
    const params = {
      offset: (this.currentPage - 1) * this.countPerPage,
      limit: this.countPerPage,
      dateFrom: this.modelDateFrom ? this.formatDate(this.modelDateFrom.date) : null,
      dateTo: this.modelDateTo ? this.formatDate(this.modelDateTo.date) : null,
      currencyId: this.currencyId || 0,
      currencyName: this.currValue || '',
    };
    this.loadingExcel = true;
    this.transactionsService
      .downloadExcel(params)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        data => {
          const blob = new Blob([data], { type: 'text/ms-excel' });
          fileSaver(blob, 'history-transactions.xlsx');
          this.loadingExcel = false;
        },
        err => {
          console.error(err);
          this.loadingExcel = false;
        }
      );
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

  openFilterPopup() {
    this.showFilterPopup = true;
  }

  closeFilterPopup() {
    this.showFilterPopup = false;
  }

  filterPopupSubmit() {
    if (this.isDateRangeValid()) {
      this.closeFilterPopup();
      this.loadTransactions();
    }
  }

  onChangeCurrPair(val: string): void {
    this.currValue = val;
    this.currencyId = null;
  }

  onSelectPair(currId: string): void {
    this.currencyId = currId;
    this.onFilter();
  }

  isFiat(currName: string): boolean {
    return this.utils.isFiat(currName);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  trackByFn(index, item) {
    return item.transactionsId;
  }
}
