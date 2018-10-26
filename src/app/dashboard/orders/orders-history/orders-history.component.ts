import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { OpenOrders } from '../open-orders.model';

@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss']
})
export class OrdersHistoryComponent implements OnInit, OnChanges {

  @Input() data;
  @Input() makeHeight ;
  public showOrders;
  public currentPage = 1;
  public countPerPage = 7;

  constructor() { }

  ngOnInit() {
    this.filterOpenOrders(this.currentPage);
  }

  filterOpenOrders(page) {
    this.currentPage = page;
    const filteredOrders = this.data.filter(order => order.status !== 'OPENED');
    this.showOrders = filteredOrders;
  }

  /**
   * change cout items when we make height biggestbiggest
   * @param changes
   */
  ngOnChanges(changes): void {
    /** change count orders perPage */
    if (changes.makeHeight.currentValue === true) {
      this.countPerPage = 7;
      this.filterOpenOrders(this.currentPage);
    } else {
      this.countPerPage = 18;
      this.filterOpenOrders(this.currentPage);
    }
  }


}
