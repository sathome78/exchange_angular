import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { OpenOrders } from '../open-orders.model';

@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss']
})
export class OrdersHistoryComponent implements OnInit, OnChanges {

  @Input() historyOrders;
  @Input() makeHeight;
  public currentPage = 1;
  public countPerPage = 7;

  constructor() { }

  ngOnInit() {
  }

  filterOpenOrders(page) {
    this.currentPage = page;
    // const filteredOrders = this.data.filter(order => order.status !== 'OPENED');
    // this.showOrders = filteredOrders;
  }

  /**
   * Change count items when we make height bigger
   *
   * @param changes
   */
  ngOnChanges(changes): void {
    if (!changes.makeHeight) { return; }
    // change count orders perPage
    this.countPerPage = changes.makeHeight.currentValue === true ? 7 : 18;
  }


}
