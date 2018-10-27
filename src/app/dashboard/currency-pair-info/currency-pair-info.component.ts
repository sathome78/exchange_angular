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
  public currentCurrencyInfo;

  constructor(
    private dashboardService: DashboardDataService,
    private marketService: MarketService,
    private mockData: MockDataService,
  ) { }

  ngOnInit() {

    this.dashboardService.getCurrencies()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value: Currency[]) => {
        this.currencies = value;
      } );


    /** for mock data*/
    // this.pair = this.mockData.getMarketsData()[0];
    // this.splitPairName(this.pair);
    /** ----------------------- */
    // this.dashboardService.choosedPair$.subscribe( res => {
    //   this.pair = res;
    //   // const infoSub = this.marketService.currencyPairInfo(this.pair.currencyPairId).subscribe(info => {
    //   //   this.currentCurrencyInfo = info;
    //   // });
    //
    // });

    // const infoSub1 = this.marketService.currencyPairInfo(this.pair.currencyPairId).subscribe(info => {
    //   this.currentCurrencyInfo = info;
    //     infoSub1.unsubscribe();
    // });

    this.marketService.activeCurrencyListener.subscribe(data => {
      this.pair = data;

      const infoSub = this.marketService.currencyPairInfo(this.pair.currencyPairId).subscribe(res => {
        this.currentCurrencyInfo = res;
        infoSub.unsubscribe();
      });

      this.splitPairName(this.pair);
    });

    // /** mock data */
    // this.currentCurrencyInfo = {
    //   "balanceByCurrency1": 0,
    //   "balanceByCurrency2": 0,
    //   "currencyRate": "516.01600000",
    //   "percentChange": "0.00",
    //   "changedValue": "0E-9",
    //   "lastCurrencyRate": "515.019160000",
    //   "volume24h": "5083.200000000",
    //   "rateHigh": "0.008214410",
    //   "rateLow": "0.008040000",
    //   "dailyStatistic": null,
    //   "statistic": null
    // };
    // /** ----------------- */
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
    this.showCurrencySearch = !this.showCurrencySearch;
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
