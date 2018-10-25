import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MockDataService} from '../../../services/mock-data.service';
import {OpenOrders} from '../open-orders.model';
import {OrdersService} from '../orders.service';
import {MarketService} from '../../markets/market.service';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TradingService} from '../../trading/trading.service';
import {Order} from '../../trading/order.model';
import {PaginationService} from '../pagination.service';

@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss']
})
export class OpenOrdersComponent implements OnInit, OnDestroy {
  @Output() countOpenOrders: EventEmitter<number> = new EventEmitter();
  @Input() smalHeighy;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public allOrders: OpenOrders[];
  public openOrders: OpenOrders[];

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
  public pager: any = [];
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
    private paginationService: PaginationService,
  ) { }


  ngOnInit() {
    this.order = {...this.defaultOrder};

    this.allOrders = this.mockData.getOpenOrders();
    this.filterOpenOrders(this.currentPage);

    this.currentPair = this.mockData.getMarketsData()[2];
    this.splitPairName();
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
  filterOpenOrders(page: number) {
    this.currentPage = page;
    const filteredOrders = this.allOrders.filter(order => order.status === 'OPENED');
    this.countOpenOrders.emit(filteredOrders.length);
    this.pager = this.paginationService.getPager(filteredOrders.length, page, this.countPerPage);
    this.openOrders = filteredOrders.slice(this.pager.startIndex, this.pager.endIndex + 1);
    console.log(this.pager.pages)
  }

  /**
   * show edit popup with selected order
   * @param order
   */
  showEditOrderPopup(order) {
    this.editOrderPopup = true;
    this.order.orderId = order.orderId;
    this.order.amount = order.amount;
    this.order.total = order.total;
    this.order.orderType = order.type;
    this.order.currencyPairId = this.currentPair.currencyPairId;
    this.order.rate = order.total / order.amount;
    this.order.commission = order.commission;
    this.getCommissionIndex();
    this.filterOpenOrders(this.currentPage);
  }

  /**
   * set status order canceled
   * @param order
   */
  cancelOrder(order) {
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
  setStatusOrder(order, status: string) {
    const foundOrder = this.allOrders.filter(item => item.orderId === order.orderId);
    if (foundOrder[0]) {
      foundOrder[0].status = status;
    }
  }

  /**
   * set order status 'Canceled' and create new
   */
  saveOrder() {
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
  deleteOrder (order) {
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
  closePopup() {
    this.editOrderPopup = false;
  }

  /**
   * recalculate on quantity input
   * @param $event
   */
  quantityIput($event) {
    this.getTotalIn();
  }

  /**
   * recalculate on rate input
   * @param $event
   */
  rateInput($event) {
    this.getTotalIn();
  }

  private getTotalIn() {
    if (this.order.rate >= 0) {
      this.order.total = this.order.amount * this.order.rate;
    }
    this.getCommission();
  }

  /**
   * set limit from dropdown-limit
   * @param limit
   */
  selectedLimit(limit) {
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
  private getCommission() {
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
  getCommissionIndex() {
    this.commissionIndex = 0.02;
    if (this.orderType && this.currentPair.currencyPairId) {
      const subscription = this.tradingService.getCommission(this.orderType, this.currentPair.currencyPairId).subscribe(res => {
        this.commissionIndex = res.commissionValue;
        subscription.unsubscribe();
      });
    }
  }
}
