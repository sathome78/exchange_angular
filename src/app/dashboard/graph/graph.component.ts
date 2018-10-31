import { Component, OnInit, AfterContentInit, OnDestroy, Input } from '@angular/core';
import { LangService } from '../../services/lang.service';
import { takeUntil } from 'rxjs/internal/operators';

import { AbstractDashboardItems } from '../abstract-dashboard-items';
import { MarketService } from '../markets/market.service';
import { Subject } from 'rxjs/Subject';

declare const TradingView: any;

import {
  widget,
  IChartingLibraryWidget,
  ChartingLibraryWidgetOptions,
  LanguageCode,
} from '../../../assets/js/charting_library/charting_library.min';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent extends AbstractDashboardItems implements OnInit, AfterContentInit, OnDestroy {
  /** dashboard item name (field for base class)*/
  public itemName: string;
  public widgetOptions: object;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  currencyPairName = 'BTC/USD';


  private lang;

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


  constructor(private marketService: MarketService, private langService: LangService) {
    super();
  }

  ngOnInit() {
    this.itemName = 'graph';

    this.lang = this.langService.getLanguage();

    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: this._symbol,
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(this._datafeedUrl),
      interval: this._interval,
      container_id: this._containerId,
      timezone: 'Etc/UTC',
      library_path: this._libraryPath,
      locale: (this.lang as LanguageCode) || 'en',
      disabled_features: [
        'use_localstorage_for_settings',
        'cl_feed_return_all_data',
        'header_settings',
        'header_symbol_search'
      ],
      charts_storage_url: this._chartsStorageUrl,
      charts_storage_api_version: this._chartsStorageApiVersion,
      client_id: this._clientId,
      user_id: this._userId,
      fullscreen: this._fullscreen,
      autosize: this._autosize,
      toolbar_bg: '#191A39',
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
        'paneProperties.background': '#191A39',
        'paneProperties.vertGridProperties.color': 'rgba(27, 55, 112, 0)',
        'paneProperties.horzGridProperties.color': 'rgba(27, 55, 112, 0)',
        'symbolWatermarkProperties.transparency': 90,
        'scalesProperties.textColor': '#aaa',
        'scalesProperties.backgroundColor': '#191A39',

        'mainSeriesProperties.areaStyle.color1': 'rgba(35, 123, 239, 1)',
        'mainSeriesProperties.areaStyle.color2': 'rgba(35, 123, 239, 0)',
      },
    };

    const tvWidget = new widget(widgetOptions);
    this._tvWidget = tvWidget;

    /** getting current currency pair */
    this.marketService.activeCurrencyListener.pipe(takeUntil(this.ngUnsubscribe)).subscribe(pair => {
      this._tvWidget.setSymbol(pair.currencyPairName, '5', () => { });
    });

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
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterContentInit() {
  }

}
