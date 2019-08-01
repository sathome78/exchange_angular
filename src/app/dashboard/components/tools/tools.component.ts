import {Component, ElementRef, Input, OnInit, ViewChild, OnDestroy} from '@angular/core';
import * as _difference from 'lodash/difference';
import * as _differenceBy from 'lodash/differenceBy';

import {DashboardService} from '../../dashboard.service';
import {ToolsItem} from 'app/shared/interfaces/dashboard-tools-interface';
import {DashboardWidgetItemModel} from 'app/shared/models/dashboard-widget-item.model';
import {DashboardToolsItemModel} from 'app/shared/models/dashboard-tools-item.model';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BreakpointService} from 'app/shared/services/breakpoint.service';

@Component({
  selector: 'app-tools',
  templateUrl: 'tools.component.html',
  styleUrls: ['tools.component.scss']
})
export class ToolsComponent implements OnInit, OnDestroy {
  /** get existing dashboard items */
  @Input() dashboardItems: ToolsItem[];
  /** get overlay */
  @ViewChild('overlay') overlay: ElementRef;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public allWidgets: DashboardWidgetItemModel[];
  public allToolsItems: DashboardToolsItemModel[];
  public visibleToolsItems: DashboardToolsItemModel[] = [];
  public overlayShow = false;

  constructor(
    private dataService: DashboardService,
    private breakpointService: BreakpointService,
  ) { }

  ngOnInit() {
    this.allWidgets = [...this.dataService.getWidgetPositions()];
    this.allToolsItems = [...this.dataService.getToolsItems()];
    // TODO: takeUntil
    this.dataService.dashboardToTools$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( res => {
        this.updateVisibleToolsItems(res as DashboardWidgetItemModel[]);
      });
    this.breakpointService.breakpoint$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        if(res === 'desktop') {
          this.checkVisibleToolsItems(this.allWidgets);
        }
      });

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Get difference between dashboard and tools items
   * @param widgets
   */
  checkVisibleToolsItems(widgets): void {
    this.visibleToolsItems = _differenceBy(this.allToolsItems, widgets, 'type');
  }
  /**
   * Get difference between dashboard and tools items
   * @param widgets
   */
  updateVisibleToolsItems(widgets: DashboardWidgetItemModel[]): void {
    const difference = _difference(this.allWidgets , widgets);
    const differenceTools = _differenceBy(this.allToolsItems, difference, 'type');
    this.visibleToolsItems = _difference( this.allToolsItems, differenceTools);
  }

  /**
   * Talk to dashboard add item
   * @param {string} typeItem
   */
  addToDashboard(typeItem: string): void {
    this.visibleToolsItems = this.visibleToolsItems.filter(item => item.type !== typeItem);
    this.dataService.toolsToDashboard$.next(typeItem);
    if (!this.visibleToolsItems.length) {
      this.hideOverlay();
    }
  }

  /**
   * show overlay
   */
  showOverlay(): void {
    this.overlayShow = true;
  }

  /**
   * hide overlay
   */
  hideOverlay(): void {
    this.overlayShow = false;
  }

  trackByFn(index, item) {
    return item.name;
  }

}
