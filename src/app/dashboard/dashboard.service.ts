import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject, Observable, ReplaySubject} from 'rxjs';
import {environment} from 'environments/environment';
import {MyBalanceItem} from 'app/core/models/my-balance-item.model';

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
      xLg: 0,
      yLg: 0,
      wLg: 2,
      hLg: 1,
      dragAndDrop: true,
      resizable: true,
      type: 'graph'
    },
    {
      xLg: 2,
      yLg: 0,
      wLg: 1,
      hLg: 1,
      dragAndDrop: true,
      resizable: true,
      type: 'markets'
    },
    {
      xLg: 0,
      yLg: 1,
      wLg: 1,
      hLg: 1,
      dragAndDrop: true,
      resizable: true,
      type: 'trading'
    },
    {
      xLg: 1,
      yLg: 1,
      wLg: 1,
      hLg: 1,
      dragAndDrop: true,
      resizable: true,
      type: 'order-book'
    },
    {
      xLg: 2,
      yLg: 1,
      wLg: 1,
      hLg: 1,
      dragAndDrop: true,
      resizable: true,
      type: 'trade-history'
    },
    {
      xLg: 0,
      yLg: 2,
      wLg: 2,
      hLg: 1,
      dragAndDrop: true,
      resizable: true,
      type: 'orders'
    },
    {
      xLg: 2,
      yLg: 2,
      wLg: 1,
      hLg: 1,
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
  ];

  constructor(private http: HttpClient) {
  }

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
    return this.http.get<any>(this.apiUrl + '/api/public/v2/pair/first/' + currencyName);
  }

  getCryptoCurrencies() {
    return this.http.get(`${this.apiUrl}/api/public/v2/crypto-currencies`);
  }
}
