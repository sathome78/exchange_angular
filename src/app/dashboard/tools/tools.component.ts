import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DashboardDataService} from '../dashboard-data.service';
import * as _difference from 'lodash/difference';
import * as _differenceBy from 'lodash/differenceBy';
import {ToolsItem} from '../../shared/interfaces/dashboard-tools-interface';
import {DashboardWidgetItemModel} from '../../shared/models/dashboard-widget-item.model';
import {DashboardToolsItemModel} from '../../shared/models/dashboard-tools-item.model';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {
  /** get existing dashboard items */
  @Input() dashboardItems: ToolsItem[];
  /** get overlay */
  @ViewChild('overlay') overlay: ElementRef;

  public allWidgets;
  public allToolsItems;
  public visibleToolsItems;
  public overlayShow = false;

  constructor(
    private dataService: DashboardDataService
  ) { }

  ngOnInit() {
    this.allWidgets = [...this.dataService.getWidgetPositions()];
    this.allToolsItems = [...this.dataService.getToolsItems()];
    this.dataService.dashboardToTools$.subscribe( res => {
      this.updateVisibleToolsItems(res);
    });
  }

  /**
   * Get difference between dashboard and tools items
   * @param widgets
   */
  updateVisibleToolsItems(widgets: DashboardWidgetItemModel): void {
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


}
