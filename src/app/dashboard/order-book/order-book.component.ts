import {Component, OnInit,  ViewChild, ElementRef} from '@angular/core';

import {AbstractDashboardItems} from '../abstract-dashboard-items';
import {OrderBookModel} from './order-book.model';

@Component({
  selector: 'app-order-book',
  templateUrl: './order-book.component.html',
  styleUrls: ['./order-book.component.scss']
})
export class OrderBookComponent extends AbstractDashboardItems implements OnInit {
  /** dashboard item name (field for base class)*/
  public itemName: string;

  @ViewChild('orderBook')
  orderbookConainer: ElementRef;

  private testMockData;
  private data;
  private isBuy: boolean;

  /** maximum value from the array "dataForVisualization"*/
  private max: number;

  /** data array for data visualization for order book  */
  private dataForVisualization: [number];

  constructor() {
    super();
  }

  ngOnInit() {
    this.itemName = 'order-book';

    /** create test mock data */
    this.testMockData = [
      {
        total: 39,
        order: 1,
        price: 6314
      },
      {
        total: 38,
        order: 2,
        price: 6310
      },
      {
        total: 88,
        order: 3,
        price: 6314
      },
      {
        total: 76,
        order: 4,
        price: 6210
      },
      {
        total: 51,
        order: 5,
        price: 6343
      },
      {
        total: 25,
        order: 6,
        price: 6321
      },
      {
        total: 21,
        order: 7,
        price: 6432
      },
      {
        total: 55,
        order: 8,
        price: 6319
      },
      {
        total: 38,
        order: 9,
        price: 6342
      },
      {
        total: 97,
        order: 10,
        price: 6313
      },
      {
        total: 71,
        order: 11,
        price: 6314
      },
      {
        total: 45,
        order: 12,
        price: 6311
      },
      {
        total: 38,
        order: 13,
        price: 6373
      },
      {
        total: 44,
        order: 14,
        price: 6354
      },
      {
        total: 37,
        order: 15,
        price: 6343
      },
      {
        total: 29,
        order: 16,
        price: 6316
      },
      {
        total: 37,
        order: 17,
        price: 6358
      },
      {
        total: 21,
        order: 18,
        price: 6367
      },
      {
        total: 97,
        order: 19,
        price: 6326
      },
      {
        total: 38,
        order: 20,
        price: 6384
      },
      {
        total: 68,
        order: 21,
        price: 6345
      },
      {
        total: 39,
        order: 22,
        price: 6333
      },
      {
        total: 38,
        order: 23,
        price: 6320
      },
      {
        total: 29,
        order: 24,
        price: 6345
      },
      {
        total: 11,
        order: 25,
        price: 6313
      },
      {
        total: 4,
        order: 26,
        price: 6314
      },
      {
        total: 0.21,
        order: 27,
        price: 6367
      },
      {
        total: 87,
        order: 28,
        price: 6399
      },
      {
        total: 91,
        order: 29,
        price: 6213
      },
      {
        total: 66,
        order: 30,
        price: 6356
      }
    ];

    this.isBuy = true;
    this.data = this.getBestItem(20, this.isBuy);
    this.max = this.getMaxDataOfArray(this.dataForVisualization);
  }

  private getBestItem(count = 20, isBuy: boolean) {
    this.sortData(isBuy);

    this.dataForVisualization = [null];

    this.testMockData.forEach((element, index) => {
      this.dataForVisualization.push(element.total);
    });

    return this.testMockData.slice(0, count);
  }

  /**
   * sort the testMockData
   * @param isAscending {Boolean}
   */
  private sortData(isAscending: boolean) {
    this.testMockData.sort((a, b) => {
      return isAscending ? b.price - a.price : a.price - b.price;
    });
  }

  private addData(): void {
    if (this.data.length + 1 <= 29) {
      this.data = this.getBestItem(this.data.length + 1, false);
    }
  }

  private removeData(): void {
    if (this.data.length - 1 >= 10) {
      this.data = this.getBestItem(this.data.length - 1, false);
    }
  }

  private getPercentageOfTheNumber(number: number): string {
    const coefficient: number = (this.max / number);
    return ((100 / coefficient) + '%');
  }

  private getMaxDataOfArray(array: [number]): number {
    return Math.max.apply(null, array);
  }

  private onSelectOrder(orderIndex, item): void {
    const index = (parseInt(orderIndex, 10) - 1);
    this.sortData(this.isBuy);
    this.data = this.testMockData.slice(orderIndex, 20);
  }
}
