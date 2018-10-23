import { Component, OnInit } from '@angular/core';
import { OpenOrders } from '../open-orders.model';

@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss']
})
export class OrdersHistoryComponent implements OnInit {

  public data: OpenOrders[];
  public page: number;
  public maxPage: number;

  public left: number;
  public middle: number;
  public right: number;
  public last: number;

  constructor() { }

  ngOnInit() {
    this.page = 1;
    this.left = 1;
    this.middle = 2;
    this.right = 3;
    this.initMockData();
    console.log(this.data.length);
    this.maxPage = (this.data.length + 1) / 7;
  }

  public clickByLeft(pageNumber: number) {
    console.log(pageNumber);
    if (pageNumber > 1) {
      this.left -= 1;
      this.middle -= 1;
      this.right -= 1;
    } else {
      this.page = pageNumber;
    }
  }

  public clickByMiddle(pageNumber: number) {
    this.page = (pageNumber - 1)  * 7;
  }

  public clickByRight(pageNumber: number) {
    this.page = (pageNumber - 1) * 7;

    if ((this.right + 1) < this.maxPage) {
      this.right += 1;
    }
    if (this.middle + 2 < this.maxPage) {
      this.middle += 1;
    }
    if (this.left + 3 < this.maxPage) {
      this.left += 1;
    }
  }

  public clickByLast() {
    this.page = (this.maxPage - 1) * 7;
  }

  public initMockData() {
    this.data = [
      {
        orderId: 1,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CLOSED'
      },
      {
        orderId: 2,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CANCELED'
      },
      {
        orderId: 3,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CLOSED'
      },
      {
        orderId: 4,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CANCELED'
      },
      {
        orderId: 5,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CLOSED'
      },
      {
        orderId: 6,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CANCELED'
      },
      {
        orderId: 7,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CLOSED'
      },
      {
        orderId: 8,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CANCELED'
      },
      {
        orderId: 9,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CLOSED'
      },
      {
        orderId: 10,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CLOSED'
      },
      {
        orderId: 11,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CANCELED'
      },
      {
        orderId: 12,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CLOSED'
      },
      {
        orderId: 13,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CANCELED'
      },
      {
        orderId: 14,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CANCELED'
      },
      {
        orderId: 15,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CANCELED'
      },
      {
        orderId: 16,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CLOSED'
      },
      {
        orderId: 17,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CANCELED'
      },
      {
        orderId: 18,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CANCELED'
      },
      {
        orderId: 19,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CLOSED '
      },
      {
        orderId: 20,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CANCELED'
      },
      {
        orderId: 21,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CLOSED'
      },
      {
        orderId: 22,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CLOSED'
      },
      {
        orderId: 23,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CANCELED'
      },
      {
        orderId: 24,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CLOSED'
      },
      {
        orderId: 25,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CANCELED'
      },
      {
        orderId: 26,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CANCELED'
      },
      {
        orderId: 27,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CLOSED'
      },
      {
        orderId: 28,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CLOSED'
      },
      {
        orderId: 29,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CANCELED'
      },
      {
        orderId: 30,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CLOSED'
      },
      {
        orderId: 31,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CANCELED'
      },
      {
        orderId: 32,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CLOSED'
      },
      {
        orderId: 33,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CANCELED'
      },      {
        orderId: 34,
        created: new Date(),
        type: 'Buy (Limit)',
        averagePrice: '4500',
        amount: '0.005BTC',
        commission: '0.02%',
        total: 6000,
        status: 'CLOSED'
      },
    ];
  }

}
