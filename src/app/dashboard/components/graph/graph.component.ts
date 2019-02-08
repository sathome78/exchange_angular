import {Component, OnInit, AfterContentInit, OnDestroy, Input, ChangeDetectorRef, HostListener} from '@angular/core';
import { takeUntil } from 'rxjs/internal/operators';
import { Subject } from 'rxjs/Subject';

import { LangService } from 'app/shared/services/lang.service';
import { AbstractDashboardItems } from '../../abstract-dashboard-items';
import { MarketService } from '../markets/market.service';
import { DashboardService } from '../../dashboard.service';

declare const TradingView: any;

import {
  widget,
  IChartingLibraryWidget,
  ChartingLibraryWidgetOptions,
  LanguageCode,
} from 'assets/js/charting_library/charting_library.min';
import {environment} from 'environments/environment';
import {select, Store} from '@ngrx/store';
import {getCurrencyPair, State} from 'app/core/reducers/index';
import {CurrencyPair} from '../../../model/currency-pair.model';
import {getCurrencyPairArray, getCurrencyPairInfo} from '../../../core/reducers';
import {Currency} from '../currency-pair-info/currency-search/currency.model';
import {DashboardWebSocketService} from '../../dashboard-websocket.service';
import {CurrencyPairInfo} from '../../../model/currency-pair-info.model';
import {SelectedOrderBookOrderAction, SetTradingTypeAction} from '../../actions/dashboard.actions';
import {Router} from '@angular/router';

@Component({
  selector: 'app-graph',
  templateUrl: 'graph.component.html',
  styleUrls: ['graph.component.scss']
})
export class GraphComponent extends AbstractDashboardItems implements OnInit, AfterContentInit, OnDestroy {
  /** dashboard item name (field for base class)*/
  public itemName: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  currencyPairName = 'BTC/USD';
  firstCurrency: string;
  secondCurrency: string;
  /** show currency search bar */
  public showCurrencySearch: boolean;
  public marketDropdown = false;
  public activeCurrency: number;
  /** available currencies */
  public currencies: Currency[];
  public isFiat = false;
  public marketsArray = [
    {name: 'USD'},
    {name: 'ETH'},
    {name: 'BTC'},
  ];
  public allCurrencyPairs;
  currentCurrencyInfo;
  private lang;
  /** current active pair */
  public pair;

  private _symbol: ChartingLibraryWidgetOptions['symbol'] = this.currencyPairName;
  private _interval: ChartingLibraryWidgetOptions['interval'] = '3';
  // BEWARE: no trailing slash is expected in feed URL
  // private _datafeedUrl = 'https://demo_feed.tradingview.com';
  private _datafeedUrl = environment.apiUrl + '/info/public/v2/graph';
  private _libraryPath: ChartingLibraryWidgetOptions['library_path'] = 'assets/js/charting_library/';
  private _chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'] = 'https://saveload.tradingview.com';
  private _chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'] = '1.1';
  private _clientId: ChartingLibraryWidgetOptions['client_id'] = 'tradingview.com';
  private _userId: ChartingLibraryWidgetOptions['user_id'] = 'public_user_id';
  private _fullscreen: ChartingLibraryWidgetOptions['fullscreen'] = false;
  private _autosize: ChartingLibraryWidgetOptions['autosize'] = true;
  private _containerId: ChartingLibraryWidgetOptions['container_id'] = 'tv_chart_container';
  private _tvWidget: IChartingLibraryWidget | null = null;


  @Input()
  set symbol(symbol: ChartingLibraryWidgetOptions['symbol']) {
    this._symbol = symbol || this._symbol;
  }

  @Input()
  set interval(interval: ChartingLibraryWidgetOptions['interval']) {
    this._interval = interval || this._interval;
  }

  @Input()
  set datafeedUrl(datafeedUrl: string) {
    this._datafeedUrl = datafeedUrl || this._datafeedUrl;
  }

  @Input()
  set libraryPath(libraryPath: ChartingLibraryWidgetOptions['library_path']) {
    this._libraryPath = libraryPath || this._libraryPath;
  }

  @Input()
  set chartsStorageUrl(chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']) {
    this._chartsStorageUrl = chartsStorageUrl || this._chartsStorageUrl;
  }

  @Input()
  set chartsStorageApiVersion(chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']) {
    this._chartsStorageApiVersion = chartsStorageApiVersion || this._chartsStorageApiVersion;
  }

  @Input()
  set clientId(clientId: ChartingLibraryWidgetOptions['client_id']) {
    this._clientId = clientId || this._clientId;
  }

  @Input()
  set userId(userId: ChartingLibraryWidgetOptions['user_id']) {
    this._userId = userId || this._userId;
  }

  @Input()
  set fullscreen(fullscreen: ChartingLibraryWidgetOptions['fullscreen']) {
    this._fullscreen = fullscreen || this._fullscreen;
  }

  @Input()
  set autosize(autosize: ChartingLibraryWidgetOptions['autosize']) {
    this._autosize = autosize || this._autosize;
  }

  @Input()
  set containerId(containerId: ChartingLibraryWidgetOptions['container_id']) {
    this._containerId = containerId || this._containerId;
  }

  private widgetOptions: ChartingLibraryWidgetOptions;


  constructor(
    private store: Store<State>,
    private marketService: MarketService,
    private router: Router,
    private langService: LangService,
    private dashboardService: DashboardService,
    private dashboardWebsocketService: DashboardWebSocketService,
    private ref: ChangeDetectorRef
    ) {
    super();
  }

  ngOnInit() {
    this.itemName = 'graph';

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
      });

    this.store
      .pipe(select(getCurrencyPairArray))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (pair: CurrencyPair[]) => {
        this.allCurrencyPairs = pair;
      });



    this.lang = this.langService.getLanguage();
    this.formattingCurrentPairName(this.currencyPairName);

    this.store
      .pipe(select(getCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (pair: CurrencyPair) => {
        this.currencyPairName = pair.currencyPairName as string;
        if (this.currencyPairName) {
          // this._tvWidget = new widget(this.widgetOptions);
          this.formattingCurrentPairName(pair.currencyPairName as string);
          // this.isFiat = pair.market === 'USD';
          try {
            this._tvWidget.setSymbol(pair.currencyPairName, '5', () => { });
          } catch (e) {
            console.log(e);
          }
        }
      });

    this.widgetOptions = {
      symbol: this._symbol,
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(this._datafeedUrl),
      interval: this._interval,
      container_id: this._containerId,
      timezone: 'Etc/UTC',
      time_frames: [
        {text: '8m', resolution: 'D'},
        {text: '2m', resolution: 'D'},
        {text: '7d', resolution: '60'},
        {text: '5d', resolution: '30'},
        {text: '3d', resolution: '30'},
      ],
      library_path: this._libraryPath,
      locale: (this.lang as LanguageCode) || 'en',
      disabled_features: [
        'use_localstorage_for_settings',
        'cl_feed_return_all_data',
        'header_settings',
        'header_symbol_search',
        'header_compare',
        'header_undo_redo',
        'header_indicators',
        'save_chart_properties_to_local_storage',
        'header_saveload',
        'border_around_the_chart'
      ],
      charts_storage_url: this._chartsStorageUrl,
      charts_storage_api_version: this._chartsStorageApiVersion,
      client_id: this._clientId,
      user_id: this._userId,
      fullscreen: this._fullscreen,
      autosize: this._autosize,
      toolbar_bg: '#252543',
      custom_css_url: '/assets/css/chart_style.css',
      // favorites: {
      //   chartTypes: ['Area'],
      //   intervals: ['30', '60', '240', '720', '1D', '2D', '3D', '1W', '3W', '1M']
      // },
      studies_overrides: {
        'volume.volume.color.0': '#00B43D',
        'volume.volume.color.1': '#EB5757',
        'volume.volume ma.color': '#FF0000',
        'volume.volume ma.linewidth': 5,
        // 'volume.show ma': true,
        // 'bollinger bands.median.color': '#33FF88',
        // 'bollinger bands.upper.linewidth': 7
      },
      overrides: {
        'paneProperties.background': '#252543',
        'paneProperties.vertGridProperties.color': 'rgba(27, 55, 112, 0)',
        'paneProperties.horzGridProperties.color': 'rgba(27, 55, 112, 0)',
        'symbolWatermarkProperties.transparency': 90,
        'scalesProperties.textColor': '#aaa',
        'scalesProperties.backgroundColor': 'rgba(0, 0, 0, 0)',

        'mainSeriesProperties.areaStyle.color1': 'rgba(35, 123, 239, 1)',
        'mainSeriesProperties.areaStyle.color2': 'rgba(35, 123, 239, 0)',
      },
    };

    const tvWidget = new widget(this.widgetOptions);
    this._tvWidget = tvWidget;

    tvWidget.onChartReady(() => {
      const button = tvWidget.createButton()
        .attr('title', 'Click to show a notification popup')
        .addClass('apply-common-tooltip')
        .on('click', () => tvWidget.showNoticeDialog({
          title: 'Notification',
          body: 'TradingView Charting Library API works correctly',
          callback: () => {
            console.log('Noticed!');
          },
        }));
      button[0].innerHTML = 'Check API';
    });

    this.marketService.activeCurrencyListener
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(pair => {
      const infoSub = this.marketService.currencyPairInfo(pair.currencyPairId)
        .subscribe(res => {
          this.currentCurrencyInfo = res;
          // this.pair = pair;
          // this.splitPairName(this.pair);
          // TODO: remove after dashboard init load time issue is solved
          this.ref.detectChanges();
          infoSub.unsubscribe();
      });
  });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterContentInit() {
  }

  formattingCurrentPairName(currentPair: string): void {
    /** search slash position */
    if (currentPair) {
      [ this.firstCurrency, this.secondCurrency ] = currentPair.split('/');
    }
  }

  setMobileWidget(widgetName: string, type: string): void {
    const item = {
      'needRefresh': true,
      'page': 0,
      'id': 0,
      'userId': 0,
      'orderType': type,
      'exrate': '0',
      'amountBase': '0',
      'amountConvert': '0',
      'ordersIds': '0'
    };

    this.dashboardService.selectedOrderTrading$.next(item);
    this.router.navigate(['/dashboard'], { queryParams: {widget: widgetName}});
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
    for (let i = 0; i < temp.length; i++) {
      const name = temp[i].currencyPairName.split('/')[0];
      this.currencies.push({name: name});
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
    return tempPair ;
  }

  /**
   * split pair name by '/'
   * @param {CurrencyPair} pair
   */
  splitPairName(pair: CurrencyPair) {
    if (pair.currencyPairId) {
      [ this.firstCurrency, this.secondCurrency ] = this.pair.currencyPairName.split('/');
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
