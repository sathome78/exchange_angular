import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ChangeDetectorRef, HostListener} from '@angular/core';
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
  @Output() refreshOpenOrders: EventEmitter<boolean> = new EventEmitter();
  @Input() makeHeight ;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() openOrders;

  public currentPair;
  public commissionIndex = 0.002;
  public orderType = 'BUY';
  public editOrderPopup = false;
  public limitsData = ['LIMIT', 'STOP_LIMIT', 'ICO'];
  public dropdownLimitValue = this.limitsData[0];
  public isDropdownOpen = false;
  public arrPairName: string[];
  public orderStop;
  public limitForm: FormGroup;
  public stopForm: FormGroup;
  public order;
  public userBalance = 300000;
  public currencyPairInfo;

  public currentPage = 1;
  public countPerPage = 7;


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
    private mockData: MockDataService,
    private ordersService: OrdersService,
    private marketService: MarketService,
    public tradingService: TradingService
  ) {
  }

  ngOnInit() {
    this.order = {...this.defaultOrder};

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

    this.marketService.currencyPairsInfo$.subscribe(res => {
      this.userBalance = res.balanceByCurrency1;
      this.order.rate = res.rate;
      this.currencyPairInfo = res;
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
    this.editOrderPopup = true;

    if (order.orderBaseType === 'STOP_LIMIT') {
      this.orderStop = order.stopRate;
      this.setStopValue(this.orderStop);
    }
    this.order.rate = order.amountWithCommission / order.amountConvert;
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
    console.log(order);
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
   console.log(editedOrder);
   this.ordersService.updateOrder(editedOrder).subscribe(res => {
     this.refreshOpenOrders.emit(true);
   });

  }


  /**
   * set order status 'Canceled' and create new
   */
  saveOrder(): void {
    if ( (this.stopForm.valid && this.orderStop && this.dropdownLimitValue === 'STOP_LIMIT') ||
      (this.limitForm.valid && this.dropdownLimitValue === 'LIMIT' || this.dropdownLimitValue === 'ICO')) {

      if (this.dropdownLimitValue === 'STOP_LIMIT') {
        this.order.stop = this.stopForm.controls['stop'].value;
        this.order.baseType = this.dropdownLimitValue;
      }

      const tempOrder = {...this.order};
      tempOrder.status = 'CANCELLED';

      this.ordersService.updateOrder(tempOrder).subscribe(res => {
        this.createNewOrder();
        this.resetForms();
      }, err => {
        console.log(err);
        this.editOrderPopup = false;
        this.resetForms();
      });
    }
  }

  /**
   * create new order after set status CANCELED
   */
  createNewOrder(): void {
    this.order.orderId = 0;
    this.order.status = 'OPENED';

    this.ordersService.createOrder(this.order).subscribe(res => {
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
    this.ordersService.deleteOrder(order).subscribe(res => {
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
   * Show readable limit value
   * @param {string} value
   * @returns {string}
   */
  showLimit(value: string): string {
    switch (value) {
      case 'LIMIT': {
        return 'Limit order';
      }
      case 'STOP_LIMIT': {
        return 'Stop limit';
      }
      case 'ICO': {
        return 'ICO order';
      }
    }
  }




  /** split pair name for show */
  private splitPairName() {
    this.arrPairName = this.currentPair.currencyPairName.split('/');
  }



  // calculate

  /**
   * recalculate on quantity input
   * @param $event
   */
  quantityInput(e): void {
    this.order.amount = e.target.value;
    this.getCommission();
  }

  stopInput(e) {
    this.orderStop = e.target.value;
  }

  /**
   * recalculate on rate input
   * @param $event
   */
  rateInput(e): void {
    this.order.rate = e.target.value;
    this.getCommission();
  }

  /**
   * on Total field input
   * @param e
   */
  totalInput(e): void {
    this.order.total = e.target.value;
    if (this.order.total > this.userBalance) {
      this.order.total = this.userBalance;
      this.setTotalInValue(this.userBalance);
    }
    if (this.order.rate > 0) {
      this.order.amount = this.order.total / this.order.rate;
      this.setQuantityValue(this.order.amount);
    }
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
   * calculation commission and update model
   */
  private getCommission(): void {
    if (this.order.rate >= 0) {
      this.order.total = this.order.amount * this.order.rate;
      this.order.commission = (this.order.rate * this.order.amount) * (this.commissionIndex / 100);
      if (this.order.orderType === 'BUY') {
        const total = this.order.total + this.order.commission;
        this.order.total = total;
        this.setTotalInValue(total);
      } else {
        const total = this.order.total - this.order.commission;
        this.order.total = total;
        this.setTotalInValue(total);
      }
    }
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
    if (this.orderType && this.currentPair.currencyPairId) {
      const subscription = this.tradingService.getCommission(this.orderType, this.currentPair.currencyPairId).subscribe(res => {
        this.commissionIndex = res.commissionValue;
        this.getCommission();
        subscription.unsubscribe();
      });
    }

    // delete
    this.getCommission();
    // ----------------
  }



  /**
   * set forms value (quantityOf)
   * @param value
   */
  setQuantityValue(value): void {
    this.stopForm.controls['quantityOf'].setValue(value);
    this.limitForm.controls['quantityOf'].setValue(value);
  }

  setPriceInValue(value): void {
    this.stopForm.controls['limit'].setValue(value);
    this.limitForm.controls['priceIn'].setValue(value);
  }

  setTotalInValue(value): void {
    this.stopForm.controls['totalIn'].setValue(value);
    this.limitForm.controls['totalIn'].setValue(value);
  }

  setStopValue(value): void {
    this.stopForm.controls['stop'].setValue(value);
  }

  resetForms(): void {
    this.limitForm.reset();
    this.stopForm.reset();
  }
}
