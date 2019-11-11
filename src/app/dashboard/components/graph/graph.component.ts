import {
  Component,
  OnInit,
  OnChanges,
  AfterContentInit,
  OnDestroy,
  Input,
  ChangeDetectorRef,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntil, take, debounceTime } from 'rxjs/internal/operators';
import { Subject } from 'rxjs/Subject';

import { LangService } from 'app/shared/services/lang.service';
import { AbstractDashboardItems } from '../../abstract-dashboard-items';
import { DashboardService } from '../../dashboard.service';

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
import { Observable, Subscription } from 'rxjs';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { UtilsService } from 'app/shared/services/utils.service';
import { GRAPH_TIME_ZONE_SUPPORT, LANG_SUPPORT } from 'app/shared/constants';
import { Animations } from 'app/shared/animations';
import { ChartService } from './services/chart.service';
import { BarData } from '../../../model/bar-data.model';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

@Component({
  selector: 'app-graph',
  templateUrl: 'graph.component.html',
  styleUrls: ['graph.component.scss'],
  animations: [Animations.componentTriggerShowOrderBook],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphComponent extends AbstractDashboardItems implements OnInit, OnChanges, AfterContentInit, OnDestroy {
  /** dashboard item name (field for base class)*/

  @Input() public graphOffset: number;
  @Input() public clearPreload: boolean;
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
  public allCurrencyPairs;
  public currentCurrencyInfo;
  private lang;
  /** current active pair */
  public pair: SimpleCurrencyPair;
  public chartReady = false;

  public showContent3 = false;

  private _symbol: ChartingLibraryWidgetOptions['symbol'] = this.currencyPairName;
  private _interval: ChartingLibraryWidgetOptions['interval'] = '30';
  private _libraryPath: ChartingLibraryWidgetOptions['library_path'] = 'assets/js/charting_library/';
  private _chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'] = 'https://saveload.tradingview.com';
  private _chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'] = '1.1';
  private _clientId: ChartingLibraryWidgetOptions['client_id'] = 'tradingview.com';
  private _userId: ChartingLibraryWidgetOptions['user_id'] = 'public_user_id';
  private _fullscreen: ChartingLibraryWidgetOptions['fullscreen'] = false;
  private _autosize: ChartingLibraryWidgetOptions['autosize'] = true;
  private _containerId: ChartingLibraryWidgetOptions['container_id'] = 'tv_chart_container';
  private _tvWidget: IChartingLibraryWidget | null = null;
  public timeZoneName: string;

  private stompClient: any;
  private lastCandleSub$: Subscription;

  private widgetOptions: ChartingLibraryWidgetOptions;

  constructor(
    private store: Store<State>,
    private router: Router,
    private langService: LangService,
    private utils: UtilsService,
    private dashboardService: DashboardService,
    private chartService: ChartService,
    private dashboardWebsocketService: DashboardWebSocketService,
    public breakpointService: BreakpointService,
    private cdr: ChangeDetectorRef
  ) {
    super();
    this.timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.isAuthenticated$ = this.store.pipe(select(getIsAuthenticated));
  }

  ngOnInit() {
    this.connectChartServer();

    this.store
      .pipe(select(getActiveCurrencyPair))
      .pipe(debounceTime(1000))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: SimpleCurrencyPair) => {
        this.pair = pair;
        this.currencyPairName = this.pair.name;
        if (this.currencyPairName) {
          this.formattingCurrentPairName(pair.name as string);
          try {
            this._tvWidget.setSymbol(this.currencyPairName, '30', () => {});  // 5
          } catch (e) {
            // console.log(e);
          }
        }
        if (!this.cdr['destroyed']) {
          this.cdr.detectChanges();
        }
      });

    this.store
      .pipe(select(getCurrencyPairInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPairInfo) => {
        this.currentCurrencyInfo = pair;
        this.splitPairName(this.pair);
        this.isFiat = this.getIsFiat(this.secondCurrency);
        if (!this.cdr['destroyed']) {
          this.cdr.detectChanges();
        }
      });

    this.store
      .pipe(select(getCurrencyPairArray))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPair[]) => {
        this.allCurrencyPairs = pair;
        if (!this.cdr['destroyed']) {
          this.cdr.detectChanges();
        }
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

    const supportedResolutions = ['5', '15', '30', '60', '360', 'D'];

    const config = {
      supported_resolutions: supportedResolutions,
    };

    this.store
      .pipe(select(getActiveCurrencyPair))
      .pipe(take(1))
      .subscribe((firstPair: SimpleCurrencyPair) => {
        this.pair = firstPair;
        this.currencyPairName = this.pair.name;
        this.widgetOptions = {
          symbol: this.currencyPairName,
          datafeed: {
            onReady: callback => {
              // console.log('onReady running -->');

              setTimeout(() => callback(config), 0);
            },
            searchSymbols: (userInput, exchange, symbolType, onResult) => {
              // console.log('searchSymbols running -->');
            },
            resolveSymbol: (symbolName, onResolve) => {
              // console.log('resolveSymbol running -->');

              setTimeout(() => {
                onResolve({
                  name: symbolName,
                  full_name: symbolName,
                  base_name: [symbolName],
                  ticker: symbolName,
                  description: symbolName,
                  type: 'bitcoin',
                  session: '24x7',
                  exchange: 'EXRATES',
                  listed_exchange: 'EXRATES',
                  timezone: 'Etc/UTC',
                  pricescale: this.isFiat ? 100 : 100_000_000,
                  minmov: 1,
                  fractional: false,
                  has_intraday: true,
                  supported_resolutions: supportedResolutions,
                  has_seconds: false,
                  has_daily: true,
                  has_weekly_and_monthly: false,
                  has_empty_bars: true,
                  force_session_rebuild: false,
                  has_no_volume: false,
                  volume_precision: 2,
                  data_status: 'streaming',
                });
              }, 0);
            },
            getBars: (symbolInfo, resolution, rangeStartDate, rangeEndDate, onResult, onError) => {
              // console.log('getBars running -->');

              this.chartService.getHistory(
                symbolInfo.name,
                resolution,
                rangeStartDate,
                rangeEndDate)
                .subscribe((data: BarData[]) => {
                  if (data.length) {
                    const bars = data.map(el => {
                      return {
                        time: el.time * 1000,
                        open: el.open,
                        high: el.high,
                        low: el.low,
                        close: el.close,
                        volume: el.volume,
                      };
                    });
                    onResult(bars, { noData: false });
                  } else {
                    this.chartService.getLastBarTime(
                      symbolInfo.name,
                      resolution,
                      rangeStartDate)
                      .subscribe((nextTime: number) => {
                        if (nextTime) {
                          onResult([], { noData: true, nextTime: nextTime * 1000 });
                        } else {
                          onResult([], { noData: true });
                        }
                      }, (error: any) => {
                        console.log(error);
                        onError(error);
                      });
                  }
                }, (error: any) => {
                  console.log(error);
                  onError(error);
                });
            },
            getServerTime: callback => {
              // console.log('getServerTime running -->');
            },
            subscribeBars: (symbolInfo, resolution, onTick) => {
              // console.log('subscribeBars running -->');

              const pairName = symbolInfo.name.toLowerCase().replace(/\//i, '_');

              this.lastCandleSub$ = this.stompClient.subscribe(`/app/chart/${pairName}/${resolution}`, (data: any) => {
                const el = JSON.parse(data.body);
                if (el) {
                  onTick({
                    time: el.time * 1000,
                    open: el.open,
                    high: el.high,
                    low: el.low,
                    close: el.close,
                    volume: el.volume,
                  });
                }
              });
            },
            unsubscribeBars: listenerGuid => {
              // console.log('unsubscribeBars running -->');

              if (this.lastCandleSub$) {
                this.lastCandleSub$.unsubscribe();
              }
            },
          },
          interval: this._interval,
          container_id: this._containerId,
          timezone: this.setTimeZoneToWidget(),
          time_frames: [
            { text: '5m', resolution: '5' },
            { text: '15m', resolution: '15' },
            { text: '30m', resolution: '30' },
            { text: '1h', resolution: '60' },
            { text: '6h', resolution: '360' },
            { text: '1D', resolution: 'D' },
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
            intervals: supportedResolutions,
          },
          studies_overrides: {
            'volume.volume.color.0': '#EB5757',
            'volume.volume.color.1': '#00B43D',
            'volume.volume ma.color': '#FF0000',
            'volume.volume ma.linewidth': 5,
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
        if (!this.cdr['destroyed']) {
          this.cdr.detectChanges();
        }
      });
  }
  ngOnChanges(data) {
    if (data.clearPreload && data.clearPreload.currentValue === false) {
      if (!this.isMobile) {
        setTimeout(() => {
          this.showContent3 = true;
          if (!this.cdr['destroyed']) {
            this.cdr.detectChanges();
          }
        }, this.graphOffset);
      } else {
        this.showContent3 = true;
        if (!this.cdr['destroyed']) {
          this.cdr.detectChanges();
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    const container = document.querySelector(`#${this._containerId} iframe`);
    if (!!this._tvWidget && this.chartReady && container) {
      this._tvWidget.remove();
      this._tvWidget = null;
    }
    if (this.stompClient != null) {
      this.stompClient.ws.close();
    }
  }

  ngAfterContentInit() {
  }

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

  private connectChartServer() {
    const socket = new SockJS(environment.chartApiUrl + '/chart_socket');
    this.stompClient = Stomp.over(socket);
    this.stompClient.debug = () => {};
    this.stompClient.connect();
  }

  get isMobile(): boolean {
    return window.innerWidth <= 1200;
  }
}
