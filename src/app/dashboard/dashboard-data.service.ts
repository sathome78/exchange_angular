import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class DashboardDataService {


   public dashboardToTools$ = new Subject();
   public toolsToDashboard$ = new Subject();

  /** Array of dashboard item options*/
  public widgetPositions = [
    {
      x: 0,
      y: 0,
      w: 12,
      h: 7,
      xMd: 0,
      yMd: 0,
      wMd: 12,
      hMd: 6,
      xLg: 0,
      yLg: 0,
      wLg: 8,
      hLg: 4,
      dragAndDrop: true,
      resizable: true,
      type: 'graph'
    },
    {
      x: 1,
      y: 0,
      w: 12,
      h: 7,
      xMd: 0,
      yMd: 4,
      wMd: 12,
      hMd: 6,
      xLg: 9,
      yLg: 0,
      wLg: 4,
      hLg: 4,
      dragAndDrop: true,
      resizable: true,
      type: 'markets'
    },
    {
      x: 1,
      y: 0,
      w: 12,
      h: 7,
      xMd: 0,
      yMd: 8,
      wMd: 12,
      hMd: 6,
      xLg: 0,
      yLg: 4,
      wLg: 4,
      hLg: 4,
      dragAndDrop: true,
      resizable: true,
      type: 'trading'
    },
    {
      x: 1,
      y: 0,
      w: 12,
      h: 7,
      xMd: 0,
      yMd: 12,
      wMd: 12,
      hMd: 6,
      xLg: 4,
      yLg: 4,
      wLg: 4,
      hLg: 4,
      dragAndDrop: true,
      resizable: true,
      type: 'order-book'
    },
    {
      x: 1,
      y: 0,
      w: 12,
      h: 7,
      xMd: 0,
      yMd: 16,
      wMd: 12,
      hMd: 6,
      xLg: 9,
      yLg: 4,
      wLg: 4,
      hLg: 4,
      dragAndDrop: true,
      resizable: true,
      type: 'trade-history'
    },
    {
      x: 1,
      y: 0,
      w: 12,
      h: 7,
      xMd: 0,
      yMd: 20,
      wMd: 12,
      hMd: 6,
      xLg: 0,
      yLg: 8,
      wLg: 8,
      hLg: 4,
      dragAndDrop: true,
      resizable: true,
      type: 'orders'
    },
    {
      x: 1,
      y: 0,
      w: 12,
      h: 7,
      xMd: 0,
      yMd: 24,
      wMd: 12,
      hMd: 6,
      xLg: 9,
      yLg: 8,
      wLg: 4,
      hLg: 4,
      dragAndDrop: true,
      resizable: true,
      type: 'chat'
    },
  ];
  /** Array of dashboard tools item */
  public dashboardToolsItems = [
    {
      imgUrl: '../../assets/img/graph.svg',
      name: 'Graph',
      type: 'graph'
    },
    {
      imgUrl: '../../assets/img/markets.svg',
      name: 'Markets',
      type: 'markets'
    },
    {
      imgUrl: '../../assets/img/trade.svg',
      name: 'Trading',
      type: 'trading'
    },
    {
      imgUrl: '../../assets/img/order-book.svg',
      name: 'Order book',
      type: 'order-book'
    },
    {
      imgUrl: '../../assets/img/history.svg',
      name: 'Trade history',
      type: 'trade-history'
    },
    {
      imgUrl: '../../assets/img/orders.svg',
      name: 'My orders',
      type: 'orders'
    },
    {
      imgUrl: '../../assets/img/header-sumbenu-link6.svg',
      name: 'Chat',
      type: 'chat'
    },
  ]

  constructor() {
  }

  /**
   * Get array of dashboard widget options
   * @returns {{x: number; y: number; w: number; h: number; xMd: number;
    * yMd: number; wMd: number; hMd: number; xLg: number; yLg: number; wLg:
     * number; hLg: number; dragAndDrop: boolean; resizable: boolean; type: string}[]}
   */
  getWidgetPositions() {
    return this.widgetPositions;
  }

  /**
   * Get array of tool items
   * @returns {{imgUrl: string; name: string; type: string}[]}
   */
  getToolsItems() {
    return this.dashboardToolsItems;
  }
}
