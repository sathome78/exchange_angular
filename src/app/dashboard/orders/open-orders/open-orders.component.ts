import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ChangeDetectorRef} from '@angular/core';
import {MockDataService} from '../../../services/mock-data.service';
import {OpenOrders} from '../open-orders.model';
import {OrdersService} from '../orders.service';
import {MarketService} from '../../markets/market.service';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TradingService} from '../../trading/trading.service';
import {Order} from '../../trading/order.model';

@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss']
})
export class OpenOrdersComponent implements OnInit, OnDestroy, OnChanges {
  // @Output() countOpenOrders: EventEmitter<number> = new EventEmitter();
  @Input() makeHeight ;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() openOrders;
  @Input() countPerPage = 7;

  public currentPair;
  public commissionIndex;
  public orderType = 'BUY';
  public editOrderPopup = false;
  public limitsData = ['LIMIT', 'STOP_LIMIT', 'ICO'];
  public dropdownLimitValue = this.limitsData[0];
  public isDropdownOpen = false;
  public arrPairName: string[];
  public orderStop;
  limitForm: FormGroup;
  stopForm: FormGroup;

  public currentPage = 1;



  // public defaultOrder: OpenOrders = new OpenOrders('', '', 0 , 0 , 0 , 0 , 0 , 0 , '');
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

  public order;

  constructor(
    private mockData: MockDataService,
    private ordersService: OrdersService,
    private marketService: MarketService,
    public tradingService: TradingService
  ) {
  }

  ngOnInit() {
    this.order = {...this.defaultOrder};

    this.filterOpenOrders(this.currentPage);

     /** mock data */
    this.currentPair = this.mockData.getMarketsData()[2];
    this.splitPairName();
    /** ---------------------- */

     this.marketService.activeCurrencyListener
       .pipe(takeUntil(this.ngUnsubscribe))
       .subscribe(pair => {
         this.currentPair = pair;
         this.splitPairName();
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
  filterOpenOrders(page: number): void {
    this.currentPage = page;
    //const filteredOrders = this.allOrders.filter(order => order.status === 'OPENED');
    // this.countOpenOrders.emit(filteredOrders.length);
    //this.openOrders = filteredOrders;
  }

  /**
   * Change count items when we make height bigger
   *
   * @param changes
   */
  ngOnChanges(changes): void {
    if (!changes.makeHeight) return;
    // change count orders perPage
    this.countPerPage = changes.makeHeight.currentValue === true ? 7 : 18;
  }

  /**
   * show edit popup with selected order
   * @param order
   */
  showEditOrderPopup(order): void {
    this.editOrderPopup = true;

    if (order.orderBaseType === 'STOP_LIMIT') {
      this.orderStop = order.stopRate;
    }
    this.order.rate = order.amountWithCommission / order.amountConvert;
    this.order.amount = order.amountConvert;
    this.order.total  = order.amountWithCommission;
    this.order.orderType = order.operationTypeEnum;
    this.order.orderId = order.id;
    this.order.currencyPairId = order.currencyPairId;
    this.dropdownLimitValue = order.orderBaseType;
    this.order.commission = order.commissionFixedAmount;
    this.getCommissionIndex();
    this.filterOpenOrders(this.currentPage);
  }

  /**
   * set status order canceled
   * @param order
   */
  cancelOrder(order): void {

   //  const orderToCancel = {
   //    orderType: order.operationType,
   //    baseType: order.amountBase,
   //    orderId: order.id,
   //    currencyPairId: order.currencyPairId,
   //    amount: order.amountConvert,
   //    rate: order.exExchangeRate,
   //    commission: order.commissionFixedAmount,
   //    total: order.amountWithCommission,
   //    status: 'CANCELLED',
   //  };
   //
   // this.ordersService.updateOrder(orderToCancel).subscribe(res => {

   // const editedOrder = this.setStatusOrder(order, 'CANCELED');
   const editedOrder = {
     orderId: order.id,
     amount: order.amountConvert,
     baseType: order.orderBaseType,
     commission: order.commissionValue,
     currencyPairId: order.currencyPairId,
     orderType: order.operationTypeEnum,
     rate: order.exExchangeRate,
     total: order.amountWithCommission,
     status: 'CANCELLED'
   };

   if (order.stopRate) {
     editedOrder.rate = order.stopRate;
   }

   this.ordersService.updateOrder(editedOrder).subscribe(res => {});
    this.filterOpenOrders(this.currentPage);
  }

  /**
   * set status order
   * @param order
   * @param {string} status
   */
  // setStatusOrder(order, status: string) {
  //   const foundOrder = this.openOrders.filter(item =>  order.id ? item.id === order.id : item.id === order.orderId);
  //   if (foundOrder[0]) {
  //     foundOrder[0].status = status;
  //   }
  //   return foundOrder[0];
  // }

  /**
   * set order status 'Canceled' and create new
   */
  saveOrder(): void {
    if (this.order.baseType === 'STOP_LIMIT') {
      this.order.stop = this.orderStop;
    }

    const tempOrder = {...this.order};
    tempOrder.status = 'CANCELLED';

    this.ordersService.updateOrder(tempOrder).subscribe(res => {
      this.createNewOrder();
    });


    // delete
    this.createNewOrder();
    //
  }

  /**
   * create new order after set status CANCELED
   */
  createNewOrder(): void {
    this.order.orderId = 0;
    this.order.status = 'OPENED';

    this.ordersService.createOrder(this.order).subscribe(res => {
      this.order = {...this.defaultOrder};
      this.orderStop = '';
      this.editOrderPopup = false;
      this.filterOpenOrders(this.currentPage);
    });

    // delete
    this.order = {...this.defaultOrder};
    this.orderStop = '';
    this.editOrderPopup = false;
    this.filterOpenOrders(this.currentPage);
    //
  }

  /**
   * on delete order
   * @param order
   */
  deleteOrder(order): void {
    //const foundOrder = this.setStatusOrder(order, 'DELETED');
    this.ordersService.deleteOrder(order).subscribe(res => {
      console.log(res);
    });
    this.filterOpenOrders(this.currentPage);
    this.editOrderPopup = false;
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

  showLimit(value: string) {
    switch (value) {
      case 'LIMIT': {
        return 'Limit';
      }
      case 'STOP_LIMIT': {
        return 'Stop limit';
      }
      case 'ICO': {
        return 'ICO';
      }
    }
  }

  /**
   * recalculate on quantity input
   * @param $event
   */
  quantityInput($event): void {
    this.getTotalIn();
  }

  /**
   * recalculate on rate input
   * @param $event
   */
  rateInput($event): void {
    this.getTotalIn();
  }

  private getTotalIn(): void {
    if (this.order.rate >= 0) {
      this.order.total = this.order.amount * this.order.rate;
    }
    this.getCommission();
  }

  /**
   * set limit from dropdown-limit
   * @param limit
   */
  selectedLimit(limit): void {
    this.dropdownLimitValue = limit;
  }

  /** split pair name for show */
  private splitPairName() {
    this.arrPairName = this.currentPair.currencyPairName.split('/');
  }

  /**
   * toggle
   */
  toggleLimitDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /**
   * calculation commission and update model
   */
  private getCommission(): void {
    this.order.commission = (this.order.rate * this.order.amount) * (this.commissionIndex / 100);
    this.order.total += this.order.commission;
  }

  /**
   * init edit forms
   */
  initForms(): void {
      this.limitForm = new FormGroup({
        quantityOf: new FormControl('', Validators.required ),
        priceIn: new FormControl('', Validators.required ),
        totalIn: new FormControl('', Validators.required ),
      });

      this.stopForm = new FormGroup({
        quantityOf: new FormControl('', Validators.required ),
        stop: new FormControl('', [Validators.required]),
        limit: new FormControl('', Validators.required ),
        totalIn: new FormControl('', Validators.required ),
      });
    }


  /**
   * get commissionIndex from server
   */
  getCommissionIndex(): void {
    this.commissionIndex = 0.02;
    if (this.orderType && this.currentPair.currencyPairId) {
      const subscription = this.tradingService.getCommission(this.orderType, this.currentPair.currencyPairId).subscribe(res => {
        this.commissionIndex = res.commissionValue;
        subscription.unsubscribe();
      });
    }
  }
}
