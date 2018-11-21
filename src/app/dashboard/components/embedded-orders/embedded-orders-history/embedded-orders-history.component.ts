import {Component, Input, OnChanges, OnInit} from '@angular/core';

@Component({
  selector: 'app-embedded-orders-history',
  templateUrl: './embedded-orders-history.component.html',
  styleUrls: ['./embedded-orders-history.component.scss']
})
export class EmbeddedOrdersHistoryComponent implements OnInit, OnChanges {

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
