import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';

import {gridsterItemOptions, gridsterOptions} from '../shared/configs/gridster-options';
import {DashboardDataService} from './dashboard-data.service';
import {DashboardItemChangeSize} from '../shared/models/dashboard-item-change-size-model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

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
    this.dataService.toolsToDashboard$.subscribe(res => this.addItemToDashboard(res));
  }

  ngAfterViewInit() {
    this.changeRatioByWidth();
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
        widget[0].hLg === this.gridsterItemOptions.maxHeight ? widget[0].hLg = this.gridsterItemOptions.maxHeight : widget[0].hLg += 3 :
        widget[0].hLg === this.gridsterItemOptions.minHeight ? widget[0].hLg = this.gridsterItemOptions.minHeight : widget[0].hLg -= 3;
    } else {
      event.isIncrement ?
        widget[0].wLg === this.gridsterItemOptions.maxWidth ? widget[0].wLg = this.gridsterItemOptions.maxWidth : widget[0].wLg += 4 :
        widget[0].wLg === this.gridsterItemOptions.minWidth ? widget[0].wLg = this.gridsterItemOptions.minWidth : widget[0].wLg -= 4;
    }
    this.gridsterContainer.reload();
  }

  /**
   * remove dashboard item from dashboard
   * @param index
   */
  removeItem(index): void {
    this.widgets.splice(index, 1);
    this.dataService.dashboardToTools$.next(this.widgets);
  }

  /**
   * add item to dashboard
   * @param itemType
   */
  addItemToDashboard(itemType): void {
    const widget = this.defauldWidgets.find( item => item.type === itemType);
    this.widgets.push(widget);
    this.gridsterContainer.reload();
  }

  /**
   * check window width for ratio
   */
  changeRatioByWidth(): void {
    const winWidth = window.innerWidth;
    if (winWidth > 1200 && winWidth < 1230) {
      this.changeRatio(.78);
    } else if (winWidth > 1230 && winWidth < 1260) {
      this.changeRatio(.80);
    } else if (winWidth > 1260 && winWidth < 1290) {
      this.changeRatio(.82);
    } else if (winWidth > 1290 && winWidth < 1310) {
      this.changeRatio(.84);
    } else if (winWidth > 1310 && winWidth < 1340) {
      this.changeRatio(.86);
    } else if (winWidth > 1340 && winWidth < 1370) {
      this.changeRatio(.88);
    } else if (winWidth > 1370 && winWidth < 1400) {
      this.changeRatio(.91);
    } else if (winWidth > 1400 && winWidth < 1430) {
      this.changeRatio(.94);
    } else if (winWidth > 1430 ) {
      this.changeRatio(.97);
    }
  }

  /**
   * change ration
   * @param {number} value
   */
  private changeRatio(value: number) {
    this.gridsterContainer.setOption('widthHeightRatio', value ).reload();
  }

}
