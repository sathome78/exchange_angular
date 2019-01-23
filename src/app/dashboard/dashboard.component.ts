import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';

import {gridsterItemOptions, gridsterOptions} from '../shared/configs/gridster-options';
import {DashboardService} from './dashboard.service';
import {DashboardItemChangeSize} from '../shared/models/dashboard-item-change-size-model';
import {MarketService} from './components/markets/market.service';
import {BreakpointService} from '../shared/services/breakpoint.service';
import {Subject} from 'rxjs';
import {OnDestroy} from '@angular/core';
import {takeUntil} from 'rxjs/internal/operators';
import {AuthService} from '../shared/services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {DashboardWebSocketService} from './dashboard-websocket.service';
import {Store, select} from '@ngrx/store';
import * as fromCore from '../core/reducers';
import * as dashboardActions from '../dashboard/actions/dashboard.actions';


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

  public activeMobileWidget = 'markets';
  public breakPoint;
  public currencyPair = null

  constructor(
    public breakPointService: BreakpointService,
    public dashboardWebsocketService: DashboardWebSocketService,
    private dataService: DashboardService,
    private marketsService: MarketService,
    private route: ActivatedRoute,
    private store: Store<fromCore.State>,
    private authService: AuthService) {
  }

  ngOnInit() {

    this.route.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(params => {
        const widget = params['widget'];
        if (widget) {
          this.activeMobileWidget = widget;
        }
      });

    this.breakPointService.breakpoint$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => this.breakPoint = res);

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

    this.route.params.subscribe(params => {
      if (params && params['currency-pair']) {
        const currencyPair: string = params['currency-pair'];
        this.dashboardWebsocketService.pairFromDashboard = currencyPair.replace('-', '/');
        // TODO find currency pair by name and set it as default for dashboard
      }
    });
    this.store
      .pipe(select(fromCore.getCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(pair => {
        this.currencyPair = pair;
      });

    this.subscribeRabbit();
  }

  subscribeRabbit() {
    return this.dashboardWebsocketService.setRabbitStompSubscription()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((message) => {
        if(this.currencyPair && (message.currencyPairId === this.currencyPair.currencyPairId)) {
          this.updateDashboard(this.currencyPair.currencyPairId);
          console.log(message);
        }
      });
  }

  updateDashboard(currencyPairId) {
    this.store.dispatch(new dashboardActions.LoadCurrencyPairInfoAction(currencyPairId))
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
   * hide widget if no authenticate
   * @param {string} widget
   * @returns {boolean}
   */
  showWidget(widget: string): boolean {
    if (!this.isAuthenticated()) {
      switch (widget) {
        case 'trade-history':
        case 'orders':
          return false;
      }
    } else {
      return true;
    }
    return true;
  }

  /**
   * change dashboard item size by coming data
   * @param event
   */
  changeItemSize(event: DashboardItemChangeSize): void {
    const widget = this.widgets.filter(item => item.type === event.itemName);
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
    const widget = this.defauldWidgets.find(item => item.type === itemType);
    this.widgets.push(widget);
    this.gridsterContainer.reload();
  }

  /**
   * check window width for ratio (static height for dashboard items)
   */
  changeRatioByWidth(): void {
    if (this.breakPoint === 'desktop') {
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
    this.gridsterContainer.setOption('widthHeightRatio', value).reload();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

}
