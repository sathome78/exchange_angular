import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef} from '@angular/core';

import {gridsterItemOptions, gridsterOptions} from '../shared/configs/gridster-options';
import {DashboardService} from './dashboard.service';
import {DashboardItemChangeSize} from '../shared/models/dashboard-item-change-size-model';
import {BreakpointService} from '../shared/services/breakpoint.service';
import {Subject} from 'rxjs';
import {OnDestroy} from '@angular/core';
import {takeUntil} from 'rxjs/internal/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {DashboardWebSocketService} from './dashboard-websocket.service';
import {Store, select} from '@ngrx/store';
import * as fromCore from '../core/reducers';
import {PopupService} from 'app/shared/services/popup.service';
import {CurrencyPair} from 'app/model';
import {getMarketCurrencyPairsMap} from '../core/reducers';
import * as dashboardActions from './actions/dashboard.actions';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { UtilsService } from 'app/shared/services/utils.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  /** retrieve gridster container*/
  @ViewChild('gridsterContainer') private gridsterContainer;

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
  public isDrag = false;

  public activeMobileWidget = 'markets';
  public breakPoint;
  public currencyPair: SimpleCurrencyPair = null
  public isAuthenticated: boolean = false;
  public widgetTemplate;

  constructor(
    public breakPointService: BreakpointService,
    public dashboardWebsocketService: DashboardWebSocketService,
    private dataService: DashboardService,
    private route: ActivatedRoute,
    private router: Router,
    private utilsService: UtilsService,
    private popupService: PopupService,
    private store: Store<fromCore.State>) {
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
    this.dataService.toolsToDashboard$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => this.addItemToDashboard(res));

    this.store
      .pipe(select(fromCore.getActiveCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: SimpleCurrencyPair) => {
        this.currencyPair = pair;
        this.changeRatioByWidth();
      });
    this.store
      .pipe(select(fromCore.getIsAuthenticated))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
        this.widgets = [];
        setTimeout(() => {
          this.widgets = this.dataService.getWidgetPositions();
        })
        this.gridsterContainer && this.gridsterContainer.reload();
      });

    this.widgetTemplate = {
      graph: this.graphTemplate,
      markets: this.marketsTemplate,
      trading: this.tradingTemplate,
      'order-book': this.orderBookTemplate,
      'trade-history': this.tradeHistoryTemplate,
      chat: this.chatTemplate,
      orders: this.ordersTemplate
    };

    this.reloadGridOnSessionExpired();
  }

  checkRoute() {
    this.route.url
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((segments) => {
        const url = segments.map((u) => u.path).join('/')
        setTimeout(() => {  // added to fix ExpressionChangedAfterItHasBeenCheckedError
          if (url === 'registration') {
            this.popupService.showMobileRegistrationPopup(true);
          }
          if(url === 'login') {
            this.popupService.showMobileLoginPopup(true);
          }
        })
      });

    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(params => {
        if (params && params['currency-pair']) {
          const currencyPair: string = params['currency-pair'];
         this.findAndSetActiveCurrencyPair(currencyPair.replace('-', '/'));
        }
      });
  }

  ngAfterViewInit() {
    this.changeRatioByWidth();
    this.checkRoute();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private reloadGridOnSessionExpired() {
    this.popupService.getSessionExpiredPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res) setTimeout(() => { this.gridsterContainer.reload(); }, 500);
      });
  }

  findAndSetActiveCurrencyPair(pairName: string) {
    this.store
      .pipe(select(getMarketCurrencyPairsMap))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((currencyPairs: MapModel<CurrencyPair>) => {
        const pair = Object.values(currencyPairs).filter(item => item.currencyPairName.toLowerCase() === pairName.toLowerCase())[0];
        if (pair) {
          const newActivePair = new SimpleCurrencyPair(pair.currencyPairId, pair.currencyPairName);
          this.store.dispatch(new dashboardActions.ChangeActiveCurrencyPairAction(newActivePair));
          this.utilsService.saveActiveCurrencyPairToSS(newActivePair);
        }
      });
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
    this.gridsterContainer && this.gridsterContainer.reload();
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
    this.gridsterContainer && this.gridsterContainer.reload();
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
    this.gridsterContainer && this.gridsterContainer.setOption('widthHeightRatio', value).reload();
  }

  DragStart(event) {
    this.isDrag = true;
  }
  DragEnd(event) {
    this.isDrag = false;
  }
}
