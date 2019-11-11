import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';

import { gridsterItemOptions, gridsterOptions } from '../shared/configs/gridster-options';
import { DashboardService } from './dashboard.service';
import { DashboardItemChangeSize } from '../shared/models/dashboard-item-change-size-model';
import { BreakpointService } from '../shared/services/breakpoint.service';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/internal/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardWebSocketService } from './dashboard-websocket.service';
import { Store, select } from '@ngrx/store';
import * as fromCore from '../core/reducers';
import { PopupService } from 'app/shared/services/popup.service';
import { CurrencyPair } from 'app/model';
import * as dashboardActions from './actions/dashboard.actions';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { UtilsService } from 'app/shared/services/utils.service';
import { Location } from '@angular/common';
import { UserService } from 'app/shared/services/user.service';
import { Animations } from 'app/shared/animations';
import { MainLoaderService } from 'app/shared/services/main-loader.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [Animations.componentTriggerShow, Animations.componentTriggerMove],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe: Subject < void > = new Subject < void > ();
  private waitPairsSub: Subject < void > = new Subject < void > ();

  public showContent = false;

  public oBookTime = 1100;
  public graphTime = 1350;
  public tradeTime = 1600;
  public marketsTime = 1850;
  public tHistoryTime = 2000;

  /** retrieve gridster container*/
  @ViewChild('gridsterContainer') private gridsterContainer;

  /** retrieve templates for loadWidgetTemplate method*/
  @ViewChild('graph') graphTemplate: TemplateRef < any > ;
  @ViewChild('markets') marketsTemplate: TemplateRef < any > ;
  @ViewChild('trading') tradingTemplate: TemplateRef < any > ;
  @ViewChild('orderBook') orderBookTemplate: TemplateRef < any > ;
  @ViewChild('tradeHistory') tradeHistoryTemplate: TemplateRef < any > ;
  @ViewChild('prediction') predictionTemplate: TemplateRef < any > ;
  @ViewChild('orders') ordersTemplate: TemplateRef < any > ;

  /** variables for resize method */
  public minWidth = 1200;
  public maxWidth = 1500;
  public minRatio = 0.731;
  public maxRatio = 0.934;
  public widthStep = 5;
  /** ---------------------- */

  public widgets;
  public defauldWidgets;
  public gridsterOptions;
  public gridsterItemOptions;
  public isDrag = false;

  public resizeTimeout;

  public activeMobileWidget = 'trading';
  public breakPoint;
  public currencyPair: SimpleCurrencyPair = null;
  public isAuthenticated = false;
  public widgetTemplate;
  public preload = true;

  constructor(
    public breakPointService: BreakpointService,
    public dashboardWebsocketService: DashboardWebSocketService,
    private mainLoaderService: MainLoaderService,
    private dataService: DashboardService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private utilsService: UtilsService,
    private userService: UserService,
    private popupService: PopupService,
    private store: Store < fromCore.State >
  ) {}

  ngOnInit() {
    this.mainLoaderService.dashboardLoader
      .pipe(take(1))
      .subscribe(() => {
        this.preload = false;
        setTimeout(() => {
          this.setAnimationTimeout();
          this.showContent = true;
        }, 700)

      }, err => {
        this.preload = false;
        setTimeout(() => {
          this.showContent = true;
          this.setAnimationTimeout();
        }, 700)
      });

    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      const widget = params['widget'];
      if (widget) {
        this.activeMobileWidget = widget;
      }
    });

    this.breakPointService.breakpoint$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => (this.breakPoint = res));

    this.dataService.activeMobileWidget
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => (this.activeMobileWidget = res));

    this.widgets = this.dataService.getWidgetPositions();
    this.defauldWidgets = this.dataService.getDefaultWidgetPositions();
    this.gridsterOptions = gridsterOptions;
    this.gridsterItemOptions = gridsterItemOptions;

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
        });
        if (this.gridsterContainer) {
          this.gridsterContainer.reload();
        }
        this.mainLoaderService.dashboardLoaderFn(isAuthenticated);
      });

    this.widgetTemplate = {
      markets: this.marketsTemplate,
      graph: this.graphTemplate,
      trading: this.tradingTemplate,
      'order-book': this.orderBookTemplate,
      'trade-history': this.tradeHistoryTemplate,
      prediction: this.predictionTemplate,
      orders: this.ordersTemplate,
    };

    this.reloadGridOnSessionExpired();
  }

  checkRoute() {
    this.route.url.pipe(takeUntil(this.ngUnsubscribe)).subscribe(segments => {
      const url = segments.map(u => u.path).join('/');
      setTimeout(() => {
        // added to fix ExpressionChangedAfterItHasBeenCheckedError
        if (url === 'registration') {
          this.popupService.showMobileRegistrationPopup(true);
        }
        if (url === 'login') {
          this.popupService.showMobileLoginPopup(true);
        }
      });
    });

    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      if (params && params['currency-pair']) {
        const currencyPair: string = params['currency-pair'];
        this.findAndSetActiveCurrencyPair(currencyPair.replace('-', '/'));
        this.location.replaceState('dashboard');
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
    this.popupService
      .getSessionExpiredPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res) {
          setTimeout(() => {
            this.gridsterContainer.reload();
          }, 500);
        }
      });
  }

  findAndSetActiveCurrencyPair(pairName: string) {
    this.store
      .pipe(select(fromCore.getSimpleCurrencyPairsSelector))
      .pipe(takeUntil(this.waitPairsSub))
      .subscribe((currencyPairs: SimpleCurrencyPair[]) => {
        if (currencyPairs.length) {
          this.waitPairsSub.next();
          this.waitPairsSub.complete();
          const pair = currencyPairs.find(el => el.name === pairName);
          if (pair) {
            this.store.dispatch(new dashboardActions.ChangeActiveCurrencyPairAction(pair));
            this.utilsService.saveActiveCurrencyPairToSS(pair);
            this.userService.getUserBalance(pair);
          }
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
        widget[0].hLg === this.gridsterItemOptions.maxHeight ?
        (widget[0].hLg = this.gridsterItemOptions.maxHeight) :
        (widget[0].hLg += 1) :
        widget[0].hLg === this.gridsterItemOptions.minHeight ?
        (widget[0].hLg = this.gridsterItemOptions.minHeight) :
        (widget[0].hLg -= 1);
    } else {
      event.isIncrement ?
        widget[0].wLg === this.gridsterItemOptions.maxWidth ?
        (widget[0].wLg = this.gridsterItemOptions.maxWidth) :
        (widget[0].wLg += 1) :
        widget[0].wLg === 2 ?
        (widget[0].wLg = 2) :
        (widget[0].wLg -= 1);
    }
    if (this.gridsterContainer) {
      this.gridsterContainer.reload();
    }
  }

  /**
   * remove dashboard item from dashboard
   * @param index
   */
  removeItem(index): void {
    this.widgets.splice(index, 1);
    this.dataService.dashboardToTools$.next(this.widgets);
  }


  setAnimationTimeout(): void {
    console.log("srgsrg")
if(!this.preload){
    setTimeout(() => {
      this.tradeTime = 30;
    }, this.tradeTime + 300);

    setTimeout(() => {
      this.oBookTime = 500;
    }, this.oBookTime + 300);

    setTimeout(() => {
      this.graphTime = 500;
    }, this.graphTime + 300);

    setTimeout(() => {
      this.marketsTime = 800;
    }, this.marketsTime + 300);

    setTimeout(() => {
      this.tHistoryTime = 500;
    }, this.tHistoryTime + 300);
    }
  }
  /**
   * add item to dashboard
   * @param itemType
   */
  addItemToDashboard(itemType): void {
    const widget = this.defauldWidgets.find(item => item.type === itemType);
    this.widgets.push(widget);
    if (this.gridsterContainer) {
      this.gridsterContainer.reload();
    }
  }

  /**
   * check window width for ratio (static height for dashboard items)
   */
  changeRatioByWidth(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(
      (() => {
        if (this.breakPoint === 'desktop') {
          const winWidth = window.innerWidth;
          const countWidthSteps = (this.maxWidth - this.minWidth) / this.widthStep;
          const ratioStep = (this.maxRatio - this.minRatio) / countWidthSteps;
          if (winWidth <= this.minWidth) {
            this.changeRatio(this.minRatio);
          } else if (winWidth > this.maxWidth) {
            this.changeRatio(this.maxRatio);
          } else {
            const ratio = ((winWidth - this.minWidth) / this.widthStep) * ratioStep + this.minRatio;
            this.changeRatio(ratio);
          }
        }
      }).bind(this),
      500
    );
  }

  /**
   * change ration
   * @param {number} value
   */
  private changeRatio(value: number) {
    if (this.gridsterContainer) {
      this.gridsterContainer.setOption('widthHeightRatio', value).reload();
    }
  }

  // tslint:disable-next-line: function-name
  DragStart(event) {
    this.isDrag = true;
  }
  // tslint:disable-next-line: function-name
  DragEnd(event) {
    this.isDrag = false;
  }

  get tradingOffset(): number {
    return this.tradeTime;
  }

  get oBookOffset(): number {
    return this.oBookTime;
  }
  get graphOffset(): number {
    return this.graphTime;
  }
  get marketsOffset(): number {
    return this.marketsTime;
  }

  get tHistoryOffset(): number {
    return this.tHistoryTime;
  }
  get clearPreload(): boolean {
    return this.preload;
  }
}
