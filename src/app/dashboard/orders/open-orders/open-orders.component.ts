import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
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
  @Output() countOpenOrders: EventEmitter<number> = new EventEmitter();
  @Input() makeHeight ;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() allOrders;
  public openOrders: any;

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
  };
  public order;

  constructor(
    private mockData: MockDataService,
    private ordersService: OrdersService,
    private marketService: MarketService,
    public tradingService: TradingService,
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

       this.ordersService.getOpenOrders(this.currentPair.currencyPairId)
         .pipe(takeUntil(this.ngUnsubscribe))
         .subscribe(res => {
         this.allOrders = res;
         this.filterOpenOrders(this.currentPage);
       });

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
    const filteredOrders = this.allOrders.filter(order => order.status === 'OPENED');
    this.countOpenOrders.emit(filteredOrders.length);
    this.openOrders = filteredOrders;
  }

  /**
   * change cout items when we make height biggestbiggest
   * @param changes
   */
  ngOnChanges(changes): void {
    /** change count orders perPage */
    if (changes.makeHeight.currentValue === true) {
      this.countPerPage = 7;
      this.filterOpenOrders(this.currentPage);
    } else {
      this.countPerPage = 18;
      this.filterOpenOrders(this.currentPage);
    }
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
    this.order.orderType = order.operationType;
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
   this.setStatusOrder(order, 'CANCELED');
    this.filterOpenOrders(this.currentPage);
   this.tradingService.updateOrder(order)
     .pipe(takeUntil(this.ngUnsubscribe))
     .subscribe(res => console.log(res));

  }

  /**
   * set status order
   * @param order
   * @param {string} status
   */
  setStatusOrder(order, status: string): void {
    const foundOrder = this.allOrders.filter(item => item.orderId === order.orderId);
    if (foundOrder[0]) {
      foundOrder[0].status = status;
    }
  }

  /**
   * set order status 'Canceled' and create new
   */
  saveOrder(): void {
    if (this.order.baseType === 'STOP_LIMIT') {
      this.order.stop = this.orderStop;
    }

    this.cancelOrder(this.order);
    this.order.orderId = 0;
    this.tradingService.createOrder(this.order)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => console.log(res));
    this.order.status = 'OPENED';
    this.allOrders.push(this.order);
    console.log(this.order);
    this.order = {...this.defaultOrder};
    this.filterOpenOrders(this.currentPage);

    this.orderStop = '';
    this.editOrderPopup = false;
  }

  /**
   * on delete order
   * @param order
   */
  deleteOrder (order): void {
    this.setStatusOrder(order, 'DELETED');
    this.tradingService.deleteOrder(order.orderId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => console.log(res));
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

  /**
   * recalculate on quantity input
   * @param $event
   */
  quantityIput($event): void {
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
