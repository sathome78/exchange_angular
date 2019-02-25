import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {getActiveCurrencyPair, getLastCreatedOrder, State} from '../../../core/reducers';
import {CurrencyPair} from '../../../model';
import {AuthService} from '../../../shared/services/auth.service';
import {EmbeddedOrdersService} from '../embedded-orders/embedded-orders.service';
import {Subject} from 'rxjs';
import {Order} from '../../../model/order.model';

@Component({
  selector: 'app-embedded-orders-mobile',
  templateUrl: './embedded-orders-mobile.component.html',
  styleUrls: ['./embedded-orders-mobile.component.scss']
})
export class EmbeddedOrdersMobileComponent implements OnInit {

  public mainTab = 'open';
  public openOrdersCount = 0;
  public historyOrders;
  public openOrders;
  public activeCurrencyPair: CurrencyPair;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private store: Store<State>,
    private authService: AuthService,
    private ordersService: EmbeddedOrdersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.store
      .pipe(select(getActiveCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPair) => {
        this.activeCurrencyPair = pair;
        this.toOpenOrders();
        this.toHistory();
      });

    this.store
      .pipe(select(getLastCreatedOrder))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((order: Order) => {
        this.toOpenOrders();
        this.toHistory();
      });
  }


  toggleMainTab(tabName: string): void {
    this.mainTab = tabName;
    this.mainTab === 'open' ?
      this.toOpenOrders() :
      this.toHistory();
  }

  toOpenOrders(): void {
    this.ordersService.getOpenOrders(this.activeCurrencyPair.currencyPairId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.openOrders = data.items;
        this.openOrdersCount = data.count;
        this.cdr.detectChanges();
      });
  }

  toHistory(): void {
    this.ordersService.getHistory(this.activeCurrencyPair.currencyPairId, 'CLOSED')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.historyOrders = data.items;
        this.cdr.detectChanges();
      });

  }

}
