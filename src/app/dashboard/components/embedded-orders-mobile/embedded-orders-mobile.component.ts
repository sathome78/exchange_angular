import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {getActiveCurrencyPair, getLastCreatedOrder, State} from '../../../core/reducers';
import {CurrencyPair} from '../../../model';
import {AuthService} from '../../../shared/services/auth.service';
import {EmbeddedOrdersService} from '../embedded-orders/embedded-orders.service';
import {Subject} from 'rxjs';
import {Order} from '../../../model/order.model';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';

@Component({
  selector: 'app-embedded-orders-mobile',
  templateUrl: './embedded-orders-mobile.component.html',
  styleUrls: ['./embedded-orders-mobile.component.scss']
})
export class EmbeddedOrdersMobileComponent implements OnInit, OnDestroy {

  public mainTab = 'open';
  public openOrdersCount = 0;
  public historyOrders;
  public openOrders;
  public activeCurrencyPair: SimpleCurrencyPair;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public loading: boolean = false;

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
      .subscribe((pair: SimpleCurrencyPair) => {
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  toggleMainTab(tabName: string): void {
    this.mainTab = tabName;
    this.mainTab === 'open' ?
      this.toOpenOrders() :
      this.toHistory();
  }

  toOpenOrders(): void {
    this.loading = true;
    this.ordersService.getOpenOrders(this.activeCurrencyPair.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.openOrders = data.items;
        this.openOrdersCount = data.count;
        this.cdr.detectChanges();
        this.loading = false;
      }, err => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  toHistory(): void {
    this.loading = true;
    this.ordersService.getHistory(this.activeCurrencyPair.id, 'CLOSED')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.historyOrders = data.items;
        this.cdr.detectChanges();
        this.loading = false;
      }, err => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      });

  }

}
