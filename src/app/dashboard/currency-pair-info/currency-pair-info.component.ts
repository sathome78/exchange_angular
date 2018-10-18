import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/internal/operators'

import { DashboardDataService } from '../dashboard-data.service';
import { Currency } from './currency-search/currency.model';

/**
 * Dashboard currency pair information component
 */
@Component({
  selector: 'app-currency-pair-info',
  templateUrl: './currency-pair-info.component.html',
  styleUrls: ['./currency-pair-info.component.scss']
})
export class CurrencyPairInfoComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  /** show currency search bar */
  showCurrencySearch: boolean;
  /** available currencies */
  currencies: Currency[];

  constructor(private dashboardService: DashboardDataService) { }

  ngOnInit() {
    this.dashboardService.getCurrencies()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value: Currency[]) => this.currencies = value);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Show/hide currency search bar
   */
  toggleCurrencySearch(): void {
    // TODO
    // if pair click and already opened need to change dropdown - not close
    this.showCurrencySearch = !this.showCurrencySearch;
  }

  /**
   * Selected currency
   *
   * @param ISO
   */
  onSelectCurrency(ISO: string): void {
    this.dashboardService.selectedCurrency$.next(ISO);
    this.toggleCurrencySearch();
  }

}
