import { EventEmitter, Output } from '@angular/core';

import { DashboardItemChangeSize } from '../shared/models/dashboard-item-change-size-model';

/**
 * Class with common logic for dashboard items
 */
export abstract class AbstractDashboardItems {
  /** create event for resize gridster item container */
  @Output() changeItemSize = new EventEmitter();
  /** create event for remove item from dashboard */
  @Output() removeItem = new EventEmitter();
  /** dashboard item name */
  protected abstract itemName: string;
  /** can make width more */
  public makeWidth = true;
  /** can make height more */
  public makeHeight = true;

  /**
   * send event for height resize item container
   * @param {boolean} value
   */
  heightChange(value: boolean): void {
    this.makeHeight = !value;
    this.changeItemSize.emit(new DashboardItemChangeSize(this.itemName, 'height', value));
  }

  /**
   * send event for width resize item container
   * @param {boolean} value
   */
  widthChange(value: boolean): void {
    this.makeWidth = !value;
    this.changeItemSize.emit(new DashboardItemChangeSize(this.itemName, 'width', value));
  }

  /**
   * send event for remove graph item dashboard
   */
  remove(): void {
    this.removeItem.emit('remove');
  }
}
