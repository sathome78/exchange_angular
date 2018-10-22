import {Component, OnInit, AfterContentInit} from '@angular/core';

import {AbstractDashboardItems} from '../abstract-dashboard-items';

declare const TradingView: any;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent extends AbstractDashboardItems implements OnInit, AfterContentInit {
  /** dashboard item name (field for base class)*/
  public itemName: string;
  public widgetOptions: object;


  private lang;

  constructor() {
    super();
  }

  ngOnInit() {
    this.itemName = 'graph';
  }

  ngAfterContentInit() {
    this.initChartWidget();
  }


  private initChartWidget() {
    this.widgetOptions = new TradingView.widget({
      'autosize': true,
      'symbol': 'NASDAQ:AAPL',
      'interval': 'D',
      'timezone': 'Etc/UTC',
      'theme': 'Dark',
      'style': '3',
      'locale': 'ru',
      'toolbar_bg': '#f1f3f6',
      'enable_publishing': false,
      'withdateranges': true,
      'hide_side_toolbar': false,
      'allow_symbol_change': true,
      'container_id': 'tradingview_afc29'
    });
  }
}
