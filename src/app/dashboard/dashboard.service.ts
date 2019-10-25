import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, ReplaySubject } from 'rxjs';
import { environment } from 'environments/environment';
import { MyBalanceItem } from 'app/model/my-balance-item.model';

@Injectable()
export class DashboardService {
  public dashboardToTools$ = new Subject();
  public toolsToDashboard$ = new Subject();
  /** talking between dashboard mobile and mobile menu */
  public activeMobileWidget = new Subject<string>();

  public selectedOrderTrading$ = new ReplaySubject();

  /** mock data for currencies which used at currency-pair-info/currency-search */
  // currencies: BehaviorSubject<Currency[]> = new BehaviorSubject<Currency[]>(mockPairs);

  /** Array of dashboard item options*/
  public widgetPositions = [
    {
      x: 0,
      y: 0,
      w: 3,
      h: 3,
      xMd: 3,
      yMd: 0,
      wMd: 3,
      hMd: 1,
      xLg: 1,
      yLg: 0,
      wLg: 2,
      hLg: 1,
      dragAndDrop: true,
      resizable: true,
      type: 'graph',
    },
    {
      x: 1,
      y: 1,
      w: 3,
      h: 3,
      xMd: 3,
      yMd: 1,
      wMd: 3,
      hMd: 1,
      xLg: 1,
      yLg: 0,
      wLg: 1,
      hLg: 1,
      dragAndDrop: true,
      resizable: true,
      type: 'markets',
    },
    {
      x: 1,
      y: 0,
      w: 3,
      h: 3,
      xMd: 0,
      yMd: 1,
      wMd: 3,
      hMd: 1,
      xLg: 0,
      yLg: 1,
      wLg: 1,
      hLg: 1,
      dragAndDrop: true,
      resizable: true,
      type: 'trading',
    },
    {
      x: 1,
      y: 0,
      w: 3,
      h: 1,
      xMd: 0,
      yMd: 0,
      wMd: 3,
      hMd: 1,
      xLg: 0,
      yLg: 0,
      wLg: 1,
      hLg: 1,
      dragAndDrop: true,
      resizable: true,
      type: 'order-book',
    },
    {
      x: 1,
      y: 0,
      w: 3,
      h: 2,
      xMd: 0,
      yMd: 3,
      wMd: 3,
      hMd: 1,
      xLg: 2,
      yLg: 3,
      wLg: 1,
      hLg: 1,
      dragAndDrop: true,
      resizable: true,
      type: 'trade-history',
    },
    {
      x: 1,
      y: 0,
      w: 3,
      h: 1,
      xMd: 0,
      yMd: 3,
      wMd: 3,
      hMd: 1,
      xLg: 0,
      yLg: 3,
      wLg: 2,
      hLg: 1,
      dragAndDrop: true,
      resizable: true,
      type: 'orders',
    },
    // {
    //   x: 1,
    //   y: 0,
    //   w: 3,
    //   h: 2,
    //   xMd: 0,
    //   yMd: 1,
    //   wMd: 3,
    //   hMd: 1,
    //   xLg: 2,
    //   yLg: 1,
    //   wLg: 1,
    //   hLg: 1,
    //   dragAndDrop: true,
    //   resizable: true,
    //   type: 'prediction'
    // },
  ];
  public defaultWidgetPositions = [...this.widgetPositions];

  /** Array of dashboard tools item */
  public dashboardToolsItems = [
    {
      imgUrl: '../../assets/img/graph.svg',
      name: 'Graph',
      type: 'graph',
    },
    {
      imgUrl: '../../assets/img/markets.svg',
      name: 'Markets',
      type: 'markets',
    },
    {
      imgUrl: '../../assets/img/trade.svg',
      name: 'Trading',
      type: 'trading',
    },
    {
      imgUrl: '../../assets/img/order-book.svg',
      name: 'Order book',
      type: 'order-book',
    },
    {
      imgUrl: '../../assets/img/history.svg',
      name: 'Trade history',
      type: 'trade-history',
    },
    {
      imgUrl: '../../assets/img/orders.svg',
      name: 'My orders',
      type: 'orders',
    },
    // {
    //   imgUrl: '../../assets/img/header-sumbenu-link6.svg',
    //   name: 'Prediction',
    //   type: 'prediction'
    // },
  ];

  constructor(private http: HttpClient) {}

  public apiUrl = environment.apiUrl;

  /**
   * Get array of dashboard widget options
   * @returns {{x: number; y: number; w: number; h: number; xMd: number;
   * yMd: number; wMd: number; hMd: number; xLg: number; yLg: number; wLg:
   * number; hLg: number; dragAndDrop: boolean; resizable: boolean; type: string}[]}
   */
  getWidgetPositions() {
    return this.widgetPositions;
  }
  getDefaultWidgetPositions() {
    return this.defaultWidgetPositions;
  }

  /**
   * Get array of tool items
   * @returns {{imgUrl: string; name: string; type: string}[]}
   */
  getToolsItems() {
    return this.dashboardToolsItems;
  }

  // /**
  //  * Get available currencies for trading (mock data for now)
  //  *
  //  * @returns {Observable<T>}
  //  */
  // getCurrencies(): Observable<Currency[]> {
  //   return this.currencies.asObservable();
  // }

  // TODO define type
  // getCurrencyPair(ISO1: string, ISO2: string) {
  //   // return this.isoMockData();
  //   // return this.http.get(`${ISO1}/${ISO2}`)
  // }

  getMyBalances(): Observable<MyBalanceItem> {
    return this.http.get<MyBalanceItem>(this.apiUrl + '/api/private/v2/balances/myBalances');
  }

  getMarketsForCurrency(currencyName): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/public/v2/pair/first/${currencyName}`);
  }

  getCryptoCurrencies() {
    return this.http.get(`${this.apiUrl}/api/public/v2/crypto-currencies`);
  }
}
