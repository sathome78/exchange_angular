import { Component, OnInit } from '@angular/core';
import {AbstractDashboardItems} from '../abstract-dashboard-items';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent extends AbstractDashboardItems implements OnInit {
  /** dashboard item name (field for base class)*/
  public itemName: string;
  public mainTab = 'open';
  public openOrdersCount = 0;

  constructor(
  ) {
    super();
  }

  ngOnInit() {
    this.itemName = 'orders';
  }

  toggleMainTab(tabName: string) {
    this.mainTab = tabName;
    console.log(this.mainTab);
  }

  setCountOpenOrders(e: number) {
    this.openOrdersCount = e;
  }

}
