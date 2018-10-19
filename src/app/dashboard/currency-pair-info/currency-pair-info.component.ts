import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/internal/operators'

import { DashboardDataService } from '../dashboard-data.service';
import { Currency } from './currency-search/currency.model';
import {MockDataService} from '../../services/mock-data.service';
import {MarketService} from '../markets/market.service';
import {CurrencyPair} from '../markets/currency-pair.model';

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
  /** current active pair */
  public pair;
  public firstCurrency: string;
  public secondCurrency: string;
  public activeCurrency: number;

  constructor(
    private dashboardService: DashboardDataService,
    private marketService: MarketService,
    private mockData: MockDataService,
  ) { }

  ngOnInit() {
    this.dashboardService.getCurrencies()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value: Currency[]) => this.currencies = value);
    /** for mock data*/
    this.pair = this.mockData.getMarketsData()[0];
    this.splitPairName(this.pair);
    /** ----------------------- */
    // this.dashboardService.choosedPair$.subscribe( res => this.pair = res);
    this.marketService.activeCurrencyListener.subscribe(data => {
      this.pair = data;
      this.splitPairName(this.pair);
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Show currency search bar
   */
  openSearchBar(currencyOrder: number): void {
    this.activeCurrency = currencyOrder;
    this.toggleCurrencySearch();
  }

  /**
   * Toggle show/hide currency search bar
   */
  toggleCurrencySearch(): void {
    // this.showCurrencySearch = !this.showCurrencySearch;
    /** make no active currency search popup */
    this.showCurrencySearch = false;
    /** ------------------- */
  }

  /**
   * Selected currency
   * @param ISO
   */
  onSelectCurrency(ISO: string): void {
    const pairName = this.createCurrencyPairName(ISO);
    this.marketService.findPairByCurrencyPairName(pairName, this.pair);
  }

  /**
   * create currency pair name
   * @param {string} newCurrency
   * @returns {string}
   */
  createCurrencyPairName(newCurrency: string): string {
    if (this.activeCurrency === 0) {
      this.firstCurrency = newCurrency;
    }if (this.activeCurrency === 1) {
      this.secondCurrency = newCurrency;
    }
    return `${this.firstCurrency}/${this.secondCurrency}`;
  }

  /**
   * split pair name by '/'
   * @param {CurrencyPair} pair
   */
  splitPairName(pair: CurrencyPair) {
    const splitName = this.pair.currencyPairName.split('/');
    this.firstCurrency = splitName[0];
    this.secondCurrency = splitName[1];
  }

}
