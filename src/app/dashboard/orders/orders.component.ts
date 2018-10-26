import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {AbstractDashboardItems} from '../abstract-dashboard-items';
import {MockDataService} from '../../services/mock-data.service';
import {OrdersService} from './orders.service';
import {MarketService} from '../markets/market.service';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import { forkJoin} from 'rxjs';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  /** dashboard item name (field for base class)*/
  public itemName: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public mainTab = 'open';
  public openOrdersCount = 0;
  public activeCurrencyPair;
  public historyOrders;
  public allOpenOrders ;


  constructor(
    private mockData: MockDataService,
    private ordersService: OrdersService,
    private marketService: MarketService,
  ) {
    super();
  }

  ngOnInit() {
    this.itemName = 'orders';

    /** mock data */
    this.allOpenOrders = this.mockData.getOpenOrders().items;
    this.historyOrders = this.mockData.getOpenOrders().items;
    /** ---------------------------------------------- */

    this.marketService.activeCurrencyListener
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
      this.activeCurrencyPair = res;
      this.toOpenOrders();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  toggleMainTab(tabName: string) {
    this.mainTab = tabName;
    this.mainTab === 'open' ?
      this.toOpenOrders() :
      this.toHistory();
  }

  toOpenOrders() {
    const sub = this.ordersService.getOpenOrders(this.activeCurrencyPair.currencyPairId)
      .subscribe(data => {
        this.allOpenOrders = data.items;
        sub.unsubscribe();
      });
  }

  toHistory() {
    const forkSubscription = forkJoin(
      this.ordersService.getHistory(this.activeCurrencyPair.currencyPairId, 'CLOSED'),
      this.ordersService.getHistory(this.activeCurrencyPair.currencyPairId, 'CANCELED')
    )
      .subscribe(([res1, res2]) => {
        this.historyOrders = [...res1.items, ...res2.items];
        forkSubscription.unsubscribe();
      });

  }

  setCountOpenOrders(e: number) {
    this.openOrdersCount = e;
  }

}
