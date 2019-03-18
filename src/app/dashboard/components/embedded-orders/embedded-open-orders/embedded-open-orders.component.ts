import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, HostListener} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import {EmbeddedOrdersService} from '../embedded-orders.service';
import {select, Store} from '@ngrx/store';
import {State, getActiveCurrencyPair} from 'app/core/reducers/index';
import {AbstractOrderCalculate} from '../../../../shared/components/abstract-order-calculate';
import {UserBalance} from '../../../../model/user-balance.model';
import {getUserBalance} from '../../../../core/reducers';
import {Order} from 'app/model/order.model';
import {TradingService} from 'app/dashboard/services/trading.service';
import {SimpleCurrencyPair} from 'app/model/simple-currency-pair';


@Component({
  selector: 'app-embedded-open-orders',
  templateUrl: './embedded-open-orders.component.html',
  styleUrls: ['./embedded-open-orders.component.scss']
})
export class EmbeddedOpenOrdersComponent extends AbstractOrderCalculate implements OnInit, OnDestroy, OnChanges {
  @Output() refreshOpenOrders: EventEmitter<boolean> = new EventEmitter();
  @Input() makeHeight ;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() openOrders;
  @Input() countPerPage = 7;

  public currentPair: SimpleCurrencyPair;
  public commissionIndex = 0.002;
  public orderType = 'BUY';
  public editOrderPopup = false;
  public dropdownLimitValue = this.limitsData[0];
  public isDropdownOpen = false;
  public orderStop;
  public order;
  public userBalance = 0;
  public currencyPairInfo;

  public currentPage = 1;
  public showCancelOrderConfirm = null;
  public loading: boolean = false;


  public defaultOrder: Order = {
    orderType: '',
    orderId: 0,
    currencyPairId: null,
    amount: null,
    rate: null,
    commission: 0,
    baseType: this.dropdownLimitValue,
    total: null,
    status: ''
  };

  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.className !== 'dropdown__btn') {
      this.isDropdownOpen = false;
    }
  }

  constructor(
    private store: Store<State>,
    private ordersService: EmbeddedOrdersService,
    public tradingService: TradingService
  ) {
    super();
  }

  ngOnInit() {
    this.order = {...this.defaultOrder};

    this.store
      .pipe(select(getActiveCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (pair: SimpleCurrencyPair) => {
        this.currentPair = pair;
        this.splitPairName();
      });

    this.store
      .pipe(select(getUserBalance))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (balance: UserBalance) => {
        // this.userBalance = balance.balanceByCurrency1 ? balance.balanceByCurrency1 : 0;
        // this.userBalance = this.userBalance < 0 ? 0 : this.userBalance;
      });

    this.tradingService.tradingChangeSellBuy$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(type => {
        this.orderType = type as string;
        this.getCommissionIndex();
    });
    this.initForms();
  }

  /**
   * filter open orders
   */
  changePage(page: number): void {
    this.currentPage = page;
    this.showCancelOrderConfirm = null;
  }

  /**
   * Change count items when we make height bigger
   * @param changes
   */
  ngOnChanges(changes): void {
    if (!changes.makeHeight) { return; }
    // change count orders perPage
    this.countPerPage = changes.makeHeight.currentValue === true ? 7 : 18;
  }

  /**
   * show edit popup with selected order
   * @param order
   */
  showEditOrderPopup(order): void {
    this.orderType = order.operationTypeEnum;
    this.editOrderPopup = true;

    if (order.orderBaseType === 'STOP_LIMIT') {
      this.orderStop = order.stopRate;
      this.setStopValue(this.orderStop);
    }
    this.order.rate = order.exExchangeRate;
    this.setPriceInValue(this.order.rate);
    this.order.amount = order.amountConvert;
    this.setQuantityValue(this.order.amount);
    this.order.total  = order.amountWithCommission;
    this.setTotalInValue(this.order.total);
    this.order.orderType = order.operationType;
    this.order.orderId = order.id;
    this.order.currencyPairId = order.currencyPairId;
    this.dropdownLimitValue = order.orderBaseType;
    this.order.baseType = order.orderBaseType;
    this.order.commission = order.commissionFixedAmount;
    this.getCommissionIndex();
  }

  /**
   * set status order canceled
   * @param order
   */
  cancelOrder(order): void {
    this.loading = true;
    this.ordersService.deleteOrder(order)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.refreshOpenOrders.emit(true);
        this.loading = false;
      }, err => {
        this.loading = false;
      });
  }

  onShowCancelOrderConfirm(orderId: string | null): void {
    this.showCancelOrderConfirm = orderId;
  }


  /**
   * set order status 'Canceled' and create new
   */
  saveOrder(): void {
    if ( (this.stopForm.valid && this.orderStop && this.dropdownLimitValue === 'STOP_LIMIT') ||
      (this.limitForm.valid && this.dropdownLimitValue === 'LIMIT' || this.dropdownLimitValue === 'ICO')) {

      if (this.dropdownLimitValue === 'STOP_LIMIT') {
        this.order.stop = this.stopForm.controls['stop'].value;
      }

      this.order.baseType = this.dropdownLimitValue;
      this.order.orderType = this.orderType;

      const tempOrder = {...this.order};
      tempOrder.status = 'CANCELLED';
      this.loading = true;
      this.ordersService.updateOrder(tempOrder)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.createNewOrder();
          this.resetForms();
          this.loading = false;
        }, err => {
          console.error(err);
          this.editOrderPopup = false;
          this.resetForms();
          this.loading = false;
        });
    }
  }

  /**
   * create new order after set status CANCELED
   */
  createNewOrder(): void {
    this.order.orderId = 0;
    this.order.status = 'OPENED';

    this.ordersService.createOrder(this.order)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.refreshOpenOrders.emit(true);
        this.order = {...this.defaultOrder};
        this.orderStop = '';
        this.editOrderPopup = false;
        this.resetForms();
      });
  }

  /**
   * on delete order
   * @param order
   */
  deleteOrder(order): void {
    this.ordersService.deleteOrder(order)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.refreshOpenOrders.emit(true);
      });
    this.editOrderPopup = false;
    this.resetForms();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * clsose edit popup
   */
  closePopup(): void {
    this.editOrderPopup = false;
  }

  /**
   * set limit from dropdown-limit
   * @param limit
   */
  selectedLimit(limit): void {
    this.dropdownLimitValue = limit;
  }

  /**
   * toggle
   */
  toggleLimitDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /**
   * get commissionIndex from server
   */
  getCommissionIndex(): void {
    if (this.orderType && this.currentPair.id) {
      this.tradingService.getCommission(this.orderType, this.currentPair.id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.commissionIndex = res.commissionValue;
          this.getCommission(this.orderType);
        });
    }
  }


}
