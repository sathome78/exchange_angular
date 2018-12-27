import {Component, OnInit, OnDestroy, HostListener, Renderer2} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import {select, Store} from '@ngrx/store';

import {DashboardService} from '../../dashboard.service';
import {Currency} from './currency-search/currency.model';
import {CurrencyPair} from 'app/model/currency-pair.model';
import {UserBalance} from 'app/model/user-balance.model';
import {State, getCurrencyPair, getUserBalance, getCurrencyPairInfo, getCurrencyPairArray} from 'app/core/reducers/index';
import {DashboardWebSocketService} from '../../dashboard-websocket.service';
import {CurrencyPairInfo} from '../../../model/currency-pair-info.model';

/**
 * Dashboard currency pair information component
 */
@Component({
  selector: 'app-currency-pair-info',
  templateUrl: 'currency-pair-info.component.html',
  styleUrls: ['currency-pair-info.component.scss']
})
export class CurrencyPairInfoComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  /** show currency search bar */
  showCurrencySearch: boolean;
  /** available currencies */
  public currencies: Currency[] = [];
  public marketsArray: Currency[] = [];
  /** current active pair */
  public pair;
  public firstCurrency: string;
  public marketDropdown = false;
  public secondCurrency: string;
  public activeCurrency: number;
  public currentCurrencyInfo;
  public userBalanceInfo: UserBalance;
  public isFiat = false; // must be defined for correct pipe work
  public showDropdownMarkets = false;
  public allCurrencyPairs;
  public allCryptoCurrencies: any = [];

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.className !== 'dropdown__btn') {
      this.marketDropdown = false;
    }
  }

  constructor(
    private store: Store<State>,
    private dashboardService: DashboardService,
    private dashboardWebsocketService: DashboardWebSocketService,
    private renderer: Renderer2,
  ) {
    this.dashboardService.getCryptoCurrencies()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((allCrypto: any) => {
        this.currencies = allCrypto.map((item) => ({name: item.name}));
      });
  }

  ngOnInit() {
    this.store
      .pipe(select(getCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (pair: CurrencyPair) => {
        this.pair = pair;
      });

    this.store
      .pipe(select(getCurrencyPairInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (pair: CurrencyPairInfo) => {
        this.currentCurrencyInfo = pair;
        this.isFiat = this.pair.market === 'USD';
        this.splitPairName(this.pair);

        this.dashboardService.getMarketsForCurrency(this.firstCurrency)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((value) => {
            this.marketsArray = value.map((item) => ({name: item.name.split('/')[1]}));
          });

      });

    this.store
      .pipe(select(getCurrencyPairArray))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (pair: CurrencyPair[]) => {
        this.allCurrencyPairs = pair;
      });

    this.store
      .pipe(select(getUserBalance))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (balance: UserBalance) => {
        if (balance.cur1 && balance.cur2) {
          this.userBalanceInfo = balance;
        } else {
          this.userBalanceInfo = null;
        }
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
    this.activeCurrency = 0;
    this.toggleCurrencySearch();
    this.renderer.addClass(document.body, 'noscroll');
  }

  openDropdown() {
    this.activeCurrency = 1;
    this.marketDropdown = true;
  }

  /**
   * Toggle show/hide currency search bar
   */
  toggleCurrencySearch(): void {
    this.marketDropdown = false;
    this.showCurrencySearch = !this.showCurrencySearch;
    this.renderer.removeClass(document.body, 'noscroll');
  }

  /**
   * Selected currency
   * @param ISO
   */
  onSelectCurrency(ISO: string): void {
    this.marketDropdown = false;
    if (this.activeCurrency === 0) {
      this.dashboardService.getMarketsForCurrency(ISO)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((value) => {
          this.marketsArray = value.map((item) => ({name: item.name.split('/')[1]}));
          const pairName = this.createCurrencyPairName(ISO);
          this.dashboardWebsocketService.findPairByCurrencyPairName(pairName);
        });
    } else {
      const pairName = this.createCurrencyPairName(ISO);
      this.dashboardWebsocketService.findPairByCurrencyPairName(pairName);
    }

  }

  /**
   * create currency pair name
   * @param {string} newCurrency
   * @returns {string}
   */
  createCurrencyPairName(newCurrency: string): string {
    let tempPair;
    if (this.activeCurrency === 0) {
      this.firstCurrency = newCurrency;
      tempPair = `${this.firstCurrency}/${this.secondCurrency}`;
      const pairIndex = this.allCurrencyPairs.findIndex((item) => item.currencyPairName === tempPair);
      if(pairIndex < 0) {
        this.secondCurrency = this.marketsArray[0].name;
        tempPair = `${this.firstCurrency}/${this.secondCurrency}`;
      }
    }
    if (this.activeCurrency === 1) {
      this.secondCurrency = newCurrency;
      tempPair = `${this.firstCurrency}/${this.secondCurrency}`;
    }
    return tempPair;
  }

  /**
   * split pair name by '/'
   * @param {CurrencyPair} pair
   */
  splitPairName(pair: CurrencyPair) {
    if (pair.currencyPairId) {
      [this.firstCurrency, this.secondCurrency] = this.pair.currencyPairName.split('/');
    }
  }

  flarForArrow(s: string) {
    if (s === 'up') {
      return this.currentCurrencyInfo ? this.currentCurrencyInfo.currencyRate - this.currentCurrencyInfo.lastCurrencyRate >= 0 :  false;
    } else {
      return this.currentCurrencyInfo ? this.currentCurrencyInfo.currencyRate - this.currentCurrencyInfo.lastCurrencyRate < 0 : false;
    }
  }
}
