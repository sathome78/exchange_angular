import {
  Component,
  OnInit,
  AfterContentInit,
  OnDestroy,
  Input,
  ChangeDetectorRef,
  HostListener,
  ChangeDetectionStrategy
} from '@angular/core';
import { takeUntil } from 'rxjs/internal/operators';
import { Subject } from 'rxjs/Subject';

import { LangService } from 'app/shared/services/lang.service';
import { AbstractDashboardItems } from '../../abstract-dashboard-items';
import { DashboardService } from '../../dashboard.service';

declare const TradingView: any;

import {
  widget,
  IChartingLibraryWidget,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  Timezone
} from 'assets/js/charting_library/charting_library.min';
import { environment } from 'environments/environment';
import { select, Store } from '@ngrx/store';
import { getActiveCurrencyPair, State, getIsAuthenticated, getLanguage } from 'app/core/reducers/index';
import { CurrencyPair } from '../../../model/currency-pair.model';
import { getCurrencyPairArray, getCurrencyPairInfo } from '../../../core/reducers';
import { DashboardWebSocketService } from '../../dashboard-websocket.service';
import { CurrencyPairInfo } from '../../../model/currency-pair-info.model';
import { SelectedOrderBookOrderAction } from '../../actions/dashboard.actions';
import { Router } from '@angular/router';
import { Currency } from 'app/model/currency.model';
import { BreakpointService } from 'app/shared/services/breakpoint.service';
import { Observable } from 'rxjs';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { UtilsService } from 'app/shared/services/utils.service';
import { GRAPH_TIME_ZONE_SUPPORT, LANG_SUPPORT } from 'app/shared/constants';
import { Animations } from 'app/shared/animations';

@Component({
  selector: 'app-graph',
  templateUrl: 'graph.component.html',
  styleUrls: ['graph.component.scss'],
  animations: [Animations.componentTriggerShowOrderBook],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphComponent extends AbstractDashboardItems implements OnInit, AfterContentInit, OnDestroy {
  /** dashboard item name (field for base class)*/
  public itemName = 'graph';

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public isAuthenticated$: Observable<boolean>;
  public currencyPairName = 'BTC/USDT';
  public firstCurrency: string;
  public secondCurrency: string;
  /** show currency search bar */
  public showCurrencySearch: boolean;
  public marketDropdown = false;
  public activeCurrency: number;
  /** available currencies */
  public currencies: Currency[];
  public isFiat = false;
  public marketsArray = [{ name: 'USD' }, { name: 'ETH' }, { name: 'BTC' }];
  public allCurrencyPairs;
  public currentCurrencyInfo;
  private lang;
  /** current active pair */
  public pair: SimpleCurrencyPair;
  public chartReady = false;

  private _symbol: ChartingLibraryWidgetOptions['symbol'] = this.currencyPairName;
  private _interval: ChartingLibraryWidgetOptions['interval'] = '30'; // 3
  // BEWARE: no trailing slash is expected in feed URL
  // private _datafeedUrl = 'https://demo_feed.tradingview.com';
  private _datafeedUrl = environment.apiUrl + '/api/public/v2/graph';
  private _libraryPath: ChartingLibraryWidgetOptions['library_path'] = 'assets/js/charting_library/';
  private _chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'] = 'https://saveload.tradingview.com';
  private _chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'] = '1.1';
  private _clientId: ChartingLibraryWidgetOptions['client_id'] = 'tradingview.com';
  private _userId: ChartingLibraryWidgetOptions['user_id'] = 'public_user_id';
  private _fullscreen: ChartingLibraryWidgetOptions['fullscreen'] = false;
  private _autosize: ChartingLibraryWidgetOptions['autosize'] = true;
  private _containerId: ChartingLibraryWidgetOptions['container_id'] = 'tv_chart_container';
  private _tvWidget: IChartingLibraryWidget | null = null;
  private _getDataInterval = 10 * 1000;
  public timeZoneName: string;
  private language: any;

  private widgetOptions: ChartingLibraryWidgetOptions;

  constructor(
    private store: Store<State>,
    private router: Router,
    private langService: LangService,
    private utils: UtilsService,
    private dashboardService: DashboardService,
    private dashboardWebsocketService: DashboardWebSocketService,
    public breakpointService: BreakpointService,
    private cdr: ChangeDetectorRef
  ) {
    super();
    this.timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.setTimeZoneToWidget();
    this.isAuthenticated$ = this.store.pipe(select(getIsAuthenticated));
  }

  ngOnInit() {
    this.store
      .pipe(select(getActiveCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: SimpleCurrencyPair) => {
        this.pair = pair;
        this.currencyPairName = this.pair.name;
        if (this.currencyPairName) {
          this.formattingCurrentPairName(pair.name as string);
          try {
            this._tvWidget.setSymbol(pair.name, '30', () => {}); // 5
          } catch (e) {
            // console.log(e);
          }
        }
        this.cdr.detectChanges();
      });

    this.store
      .pipe(select(getCurrencyPairInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPairInfo) => {
        this.currentCurrencyInfo = pair;
        this.splitPairName(this.pair);
        this.isFiat = this.getIsFiat(this.secondCurrency);
        this.cdr.detectChanges();
      });

    this.store
      .pipe(select(getCurrencyPairArray))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPair[]) => {
        this.allCurrencyPairs = pair;
        this.cdr.detectChanges();
      });

    this.formattingCurrentPairName(this.currencyPairName);

    this.store
      .pipe(select(getLanguage))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(lang => {
        this.lang = lang;
        if (!!this._tvWidget) {
          this._tvWidget.setLanguage(this.setLang());
        }
      });

    this.widgetOptions = {
      symbol: this.currencyPairName,
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(this._datafeedUrl, this._getDataInterval),
      interval: this._interval,
      container_id: this._containerId,
      timezone: this.setTimeZoneToWidget(),
      time_frames: [
        { text: '1D', resolution: 'D' },
        { text: '6h', resolution: '360' },
        { text: '1h', resolution: '60' },
        { text: '30m', resolution: '30' },
        { text: '15m', resolution: '15' },
        { text: '5m', resolution: '5' },
      ],
      library_path: this._libraryPath,
      locale: this.setLang(),
      disabled_features: [
        'use_localstorage_for_settings',
        'cl_feed_return_all_data',
        'header_settings',
        'header_symbol_search',
        'header_compare',
        'header_undo_redo',
        'header_indicators',
        // 'header_resolutions', // hidden by DEVEX-3308
        'save_chart_properties_to_local_storage',
        'header_saveload',
        'border_around_the_chart',
      ],
      charts_storage_url: this._chartsStorageUrl,
      charts_storage_api_version: this._chartsStorageApiVersion,
      client_id: this._clientId,
      user_id: this._userId,
      fullscreen: this._fullscreen,
      autosize: this._autosize,
      toolbar_bg: '#252543',
      custom_css_url: '/assets/css/chart_style.css',
      favorites: {
        chartTypes: ['Area'],
        intervals: ['5', '15', '30', '60', '360', '1D'],
      },
      studies_overrides: {
        'volume.volume.color.0': '#EB5757',
        'volume.volume.color.1': '#00B43D',
        'volume.volume ma.color': '#FF0000',
        'volume.volume ma.linewidth': 5,
        // 'volume.show ma': true,
        // 'bollinger bands.median.color': '#33FF88',
        // 'bollinger bands.upper.linewidth': 7
      },
      overrides: {
        'paneProperties.background': '#252543',
        'paneProperties.vertGridProperties.color': '#1A1F42',
        'paneProperties.horzGridProperties.color': '#1A1F42',
        'symbolWatermarkProperties.transparency': 90,
        'scalesProperties.textColor': '#aaa',
        'scalesProperties.backgroundColor': 'rgba(0, 0, 0, 0)',

        'mainSeriesProperties.areaStyle.color1': 'rgba(35, 123, 239, 1)',
        'mainSeriesProperties.areaStyle.color2': 'rgba(35, 123, 239, 0)',

        'mainSeriesProperties.candleStyle.wickUpColor': '#53B987',
        'mainSeriesProperties.candleStyle.wickDownColor': '#EB5757',
      },
    };

    const tvWidget = new widget(this.widgetOptions);
    this._tvWidget = tvWidget;

    tvWidget.onChartReady(() => {
      this.chartReady = true;
      const button = tvWidget
        .createButton()
        .attr('title', 'Click to show a notification popup')
        .addClass('apply-common-tooltip')
        .on('click', () =>
          tvWidget.showNoticeDialog({
            title: 'Notification',
            body: 'TradingView Charting Library API works correctly',
            callback: () => {
              // console.log('Noticed!');
            },
          })
        );
      button[0].innerHTML = 'Check API';
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    debugger
    const container = document.querySelector(`#${this._containerId} iframe`);
    if (!!this._tvWidget && this.chartReady && container) {
      this._tvWidget.remove();
      this._tvWidget = null;
    }
  }

  ngAfterContentInit() {}

  formattingCurrentPairName(currentPair: string): void {
    /** search slash position */
    if (currentPair) {
      [this.firstCurrency, this.secondCurrency] = currentPair.split('/');
    }
  }

  setMobileWidget(widgetName: string, type: string): void {
    const item = {
      needRefresh: true,
      page: 0,
      id: 0,
      userId: 0,
      orderType: type,
      exrate: '0',
      amountBase: '0',
      amountConvert: '0',
      ordersIds: '0',
    };

    this.dashboardService.selectedOrderTrading$.next(item);
    this.router.navigate(['/dashboard'], {
      queryParams: { widget: widgetName },
    });
    this.dashboardService.activeMobileWidget.next(widgetName);
    this.store.dispatch(new SelectedOrderBookOrderAction(item));
    // this.store.dispatch(new SetTradingTypeAction(type));
  }

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.className !== 'dropdown__btn') {
      this.marketDropdown = false;
    }
  }

  openSearchBar(currencyOrder: number): void {
    this.activeCurrency = 0;
    this.toggleCurrencySearch();
  }

  openDropdown() {
    this.activeCurrency = 1;
    this.marketDropdown = true;
  }

  /**
   * Toggle show/hide currency search bar
   */
  toggleCurrencySearch(): void {
    const temp = this.allCurrencyPairs.filter(pair => pair.market === this.secondCurrency);
    this.currencies = [];
    for (let i = 0; i < temp.length; i += 1) {
      const name = temp[i].currencyPairName.split('/')[0];
      this.currencies.push({ name });
    }
    this.marketDropdown = false;
    this.showCurrencySearch = !this.showCurrencySearch;
  }

  /**
   * Selected currency
   * @param ISO
   */
  onSelectCurrency(ISO: string): void {
    this.marketDropdown = false;
    const pairName = this.createCurrencyPairName(ISO);
    this.dashboardWebsocketService.findPairByCurrencyPairName(pairName);
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
    }
    if (this.activeCurrency === 1) {
      this.secondCurrency = newCurrency;
      this.allCurrencyPairs.forEach((pair, index) => {
        if (pair.market === this.secondCurrency) {
          tempPair = pair.currencyPairName;
        }
        if (pair.currencyPairName === `${this.firstCurrency}/${this.secondCurrency}`) {
          tempPair = `${this.firstCurrency}/${this.secondCurrency}`;
        }
      });
    }
    return tempPair;
  }

  /**
   * split pair name by '/'
   * @param {CurrencyPair} pair
   */
  splitPairName(pair: SimpleCurrencyPair) {
    if (pair) {
      [this.firstCurrency, this.secondCurrency] = this.pair.name.split('/');
    }
  }

  flarForArrow(s: string) {
    if (s === 'up') {
      return this.currentCurrencyInfo
        ? this.currentCurrencyInfo.currencyRate - this.currentCurrencyInfo.lastCurrencyRate >= 0
        : false;
    }
    return this.currentCurrencyInfo
      ? this.currentCurrencyInfo.currencyRate - this.currentCurrencyInfo.lastCurrencyRate < 0
      : false;
  }

  getIsFiat(curr): boolean {
    return this.utils.isFiat(curr);
  }

  toMobileWidget(widgetName: string) {
    this.dashboardService.activeMobileWidget.next(widgetName);
  }

  private setTimeZoneToWidget(): Timezone {
    if (!!this.timeZoneName) {
      const indexCandidate = GRAPH_TIME_ZONE_SUPPORT.indexOf(this.timeZoneName);
      return indexCandidate !== -1 ? <Timezone>GRAPH_TIME_ZONE_SUPPORT[indexCandidate] : <Timezone>this.timeZoneName;
    }
    return 'Etc/UTC';
  }

  private setLang(): LanguageCode {
    const indexCandidate = LANG_SUPPORT.indexOf(this.lang);
    return indexCandidate !== -1 ? <LanguageCode>LANG_SUPPORT[indexCandidate] : <LanguageCode>'en';
  }
}
