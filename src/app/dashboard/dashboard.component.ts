import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';

import {gridsterItemOptions, gridsterOptions} from '../shared/configs/gridster-options';
import {DashboardDataService} from './dashboard-data.service';
import {DashboardItemChangeSize} from '../shared/models/dashboard-item-change-size-model';
import {MarketService} from './markets/market.service';
import {BreakpointService} from '../services/breackpoint.service';
import {Subject} from 'rxjs';
import {OnDestroy} from '@angular/core';
import {takeUntil} from 'rxjs/internal/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

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

  /** variables for resize method */
  public minWidth = 1200;
  public maxWidth = 1500;
  public minRatio = 0.76;
  public maxRatio = 0.94;
  public widthStep = 5;
  /** ---------------------- */

  public widgets;
  public defauldWidgets;
  public gridsterOptions;
  public gridsterItemOptions;

  public activeMobileWidget =  'markets';

  public breackPoint;

  constructor(
    public breackPointService: BreakpointService,
    private dataService: DashboardDataService,
    private marketsService: MarketService,
  ) { }

  ngOnInit() {
    this.breackPointService.breakpoint
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
      this.breackPoint = res;
    });

    this.dataService.activeMobileWidget
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => this.activeMobileWidget = res);

    this.widgets = this.dataService.getWidgetPositions();
    this.defauldWidgets = [...this.widgets];
    this.gridsterOptions = gridsterOptions;
    this.gridsterItemOptions = gridsterItemOptions;
    // TODO: takeUntil
    this.dataService.toolsToDashboard$.subscribe(res => this.addItemToDashboard(res));

    this.marketsService.activeCurrencyListener.subscribe(res => {
      this.changeRatioByWidth();
    });
  }

  ngAfterViewInit() {
    this.changeRatioByWidth();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
        widget[0].hLg === this.gridsterItemOptions.maxHeight ? widget[0].hLg = this.gridsterItemOptions.maxHeight : widget[0].hLg += 1 :
        widget[0].hLg === this.gridsterItemOptions.minHeight ? widget[0].hLg = this.gridsterItemOptions.minHeight : widget[0].hLg -= 1;
    } else {
      event.isIncrement ?
        widget[0].wLg === this.gridsterItemOptions.maxWidth ? widget[0].wLg = this.gridsterItemOptions.maxWidth : widget[0].wLg += 1 :
        widget[0].wLg === 2 ? widget[0].wLg = 2 : widget[0].wLg -= 1;
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
   * check window width for ratio (static height for dashboard items)
   */
  changeRatioByWidth(): void {
    if (this.breackPoint === 'desktop') {
      const winWidth = window.innerWidth;
      const countWidthSteps = (this.maxWidth - this.minWidth) / this.widthStep;
      const ratioStep = (this.maxRatio - this.minRatio) / countWidthSteps;
      if (winWidth <= this.minWidth) {
        this.changeRatio(this.minRatio);
      } else if (winWidth > this.maxWidth) {
        this.changeRatio(this.maxRatio);
      } else {
        const ratio = (((winWidth - this.minWidth) / this.widthStep) * ratioStep) + this.minRatio;
        this.changeRatio(ratio);
      }
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
