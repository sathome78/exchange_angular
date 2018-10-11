import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';

import {gridsterItemOptions, gridsterOptions} from '../shared/configs/gridster-options';
import {DashboardDataService} from './dashboard-data.service';
import {DashboardItemChangeSize} from '../shared/models/dashboard-item-change-size-model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  /** retrieve gridster container*/
  @ViewChild('gridsterContainer') gridsterContainer;

  /** retrieve templates for loadWidgetTemplate method*/
  @ViewChild('graph') graphTemplate: TemplateRef<any>;
  @ViewChild('markets') marketsTemplate: TemplateRef<any>;
  @ViewChild('trading') tradingTemplate: TemplateRef<any>;
  @ViewChild('orderBook') orderBookTemplate: TemplateRef<any>;
  @ViewChild('tradeHistory') tradeHistoryTemplate: TemplateRef<any>;
  @ViewChild('chat') chatTemplate: TemplateRef<any>;
  @ViewChild('orders') ordersTemplate: TemplateRef<any>;

  public widgets;
  public defauldWidgets;
  public gridsterOptions;
  public gridsterItemOptions;

  constructor(
    private dataService: DashboardDataService
  ) { }

  ngOnInit() {
    this.widgets = this.dataService.getWidgetPositions();
    this.defauldWidgets = [...this.widgets];
    this.gridsterOptions = gridsterOptions;
    this.gridsterItemOptions = gridsterItemOptions;
  }

  /**
   * get template for directive *ngFor
   * @param {string} value
   * @returns {TemplateRef<any>}
   */
  loadWidgetTemplate(value: string): TemplateRef<any> {
    switch (value) {
      case 'graph':
        return this.graphTemplate;
      case 'markets':
        return this.marketsTemplate;
      case 'trading':
        return this.tradingTemplate;
      case 'order-book':
        return this.orderBookTemplate;
      case 'trade-history':
        return this.tradeHistoryTemplate;
      case 'chat':
        return this.chatTemplate;
      case 'orders':
        return this.ordersTemplate;
    }
  }

  /**
   * change dashboard item size by coming data
   * @param event
   */
  changeItemSize(event: DashboardItemChangeSize): void {
    const widget = this.widgets.filter( item => item.type === event.itemName);
    if (event.widthOrHeight === 'height') {
      event.isIncrement ?
        widget[0].hLg === this.gridsterItemOptions.maxHeight ? widget[0].hLg = this.gridsterItemOptions.maxHeight : widget[0].hLg++ :
        widget[0].hLg === this.gridsterItemOptions.minHeight ? widget[0].hLg = this.gridsterItemOptions.minHeight : widget[0].hLg--;
      this.gridsterContainer.reload();
    } else {
      event.isIncrement ?
        widget[0].wLg === this.gridsterItemOptions.maxWidth ? widget[0].wLg = this.gridsterItemOptions.maxWidth : widget[0].wLg++ :
        widget[0].wLg === this.gridsterItemOptions.minWidth ? widget[0].wLg = this.gridsterItemOptions.minWidth : widget[0].wLg--;
      this.gridsterContainer.reload();
    }
  }

  /**
   * remove dashboard item from dashboard
   * @param index
   */
  removeItem(index): void {
    this.widgets.splice(index, 1);
  }
}
