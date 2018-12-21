import {Component, OnDestroy, OnInit, Input} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {Store, select} from '@ngrx/store';
import * as fundsReducer from '../store/reducers/funds.reducer';
import * as fundsAction from '../store/actions/funds.actions';
import {BalanceItem} from '../models/balance-item.model';
import {PendingRequestsItem} from '../models/pending-requests-item.model';
import {MyBalanceItem} from '../../core/models/my-balance-item.model';
import {BalanceService} from '../services/balance.service';
import {takeUntil} from 'rxjs/operators';
import {CRYPTO_DEPOSIT, CRYPTO_WITHDRAWAL, INNER_TRANSFER} from './send-money/send-money-constants';
import {CurrencyChoose} from '../models/currency-choose.model';
import * as fromCore from '../../core/reducers';
import {DashboardWebSocketService} from '../../dashboard/dashboard-websocket.service';
import {Router} from '@angular/router';
import {PopupService} from '../../shared/services/popup.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit, OnDestroy {

  /** */
  public Tab = {
    CRYPTO: 'CRYPTO',
    FIAT: 'FIAT',
    PR: 'PR',
  };

  public balanceItems: BalanceItem [] = [];
  public currTab: string = this.Tab.CRYPTO;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public showRefillBalancePopup: boolean = false;
  public showSendMoneyPopup: boolean = false;
  public hideAllZero: boolean = false;

  public cryptoBalances$: Observable<BalanceItem[]>;
  public countOfCryptoEntries$: Observable<number>;
  public fiatBalances$: Observable<BalanceItem[]>;
  public countOfFiatEntries$: Observable<number>;
  public pendingRequests$: Observable<PendingRequestsItem[]>;
  public countOfPendingRequests$: Observable<number>;
  public myBalances$: Observable<MyBalanceItem>;
  public cryptoCurrenciesForChoose$: Observable<CurrencyChoose[]>;
  public fiatCurrenciesForChoose$: Observable<CurrencyChoose[]>;

  public sendMoneyData = {};
  public refillBalanceData = {};
  public currencyForChoose: string = null;

  public currentPage = 1;
  public countPerPage = 15;

  constructor(
    public balanceService: BalanceService,
    private store: Store<fromCore.State>,
    private dashboardWS: DashboardWebSocketService,
    private popupService: PopupService,
    private router: Router
  ) {
    this.cryptoBalances$ = store.pipe(select(fundsReducer.getCryptoBalancesSelector));
    this.countOfCryptoEntries$ = store.pipe(select(fundsReducer.getCountCryptoBalSelector));
    this.fiatBalances$ = store.pipe(select(fundsReducer.getFiatBalancesSelector));
    this.countOfFiatEntries$ = store.pipe(select(fundsReducer.getCountFiatBalSelector));
    this.pendingRequests$ = store.pipe(select(fundsReducer.getPendingRequestsSelector));
    this.countOfPendingRequests$ = store.pipe(select(fundsReducer.getCountPendingReqSelector));
    this.myBalances$ = store.pipe(select(fundsReducer.getMyBalancesSelector));
    this.cryptoCurrenciesForChoose$ = store.pipe(select(fromCore.getCryptoCurrenciesForChoose));
    this.fiatCurrenciesForChoose$ = store.pipe(select(fromCore.getFiatCurrenciesForChoose));
  }

  ngOnInit() {
    if (this.isMobile) {
      this.countPerPage = 30;
    }

    this.store.dispatch(new fundsAction.LoadAllCurrenciesForChoose());
    this.store.dispatch(new fundsAction.LoadCryptoCurrenciesForChoose());
    this.store.dispatch(new fundsAction.LoadFiatCurrenciesForChoose());
    this.store.dispatch(new fundsAction.LoadMyBalancesAction());
    this.loadBalances(this.currTab);
    this.loadBalances(this.Tab.PR);

    this.balanceService.closeRefillMoneyPopup$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.openRefillBalancePopup(res);
      });

    this.balanceService.closeSendMoneyPopup$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.openSendMoneyPopup(res);
      });
  }

  public get isMobile(): boolean {
    return window.innerWidth <= 1200;
  }

  public onSelectTab(tab: string): void {
    this.currTab = tab;
    this.currentPage = 1;
    this.loadBalances(this.currTab);
  }

  public onPageChanged({currentPage, countPerPage}): void {
    this.countPerPage = countPerPage;
    this.currentPage = currentPage;
    this.loadBalances(this.currTab);
  }

  public loadBalances(type: string, concat?: boolean) {
    switch (type) {
      case this.Tab.CRYPTO :
        const paramsC = {
          type,
          currencyName: this.currencyForChoose || '',
          offset: (this.currentPage - 1) * this.countPerPage,
          limit: this.countPerPage,
          excludeZero: this.hideAllZero,
          concat: concat || false,
        };
        return this.store.dispatch(new fundsAction.LoadCryptoBalAction(paramsC));
      case this.Tab.FIAT :
        const paramsF = {
          type,
          currencyName: this.currencyForChoose || '',
          offset: (this.currentPage - 1) * this.countPerPage,
          limit: this.countPerPage,
          excludeZero: this.hideAllZero,
          concat: concat || false,
        };
        return this.store.dispatch(new fundsAction.LoadFiatBalAction(paramsF));
      case this.Tab.PR :
        const paramsP = {
          offset: (this.currentPage - 1) * this.countPerPage,
          limit: this.countPerPage,
          concat: concat || false,
        };
        return this.store.dispatch(new fundsAction.LoadPendingReqAction(paramsP));
    }

  }

  public getCountOfEntries() {
    switch (this.currTab) {
      case this.Tab.CRYPTO :
        return this.countOfCryptoEntries$;
      case this.Tab.FIAT :
        return this.countOfFiatEntries$;
      case this.Tab.PR :
        return this.countOfPendingRequests$;
      default:
        return this.countOfCryptoEntries$;
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public openRefillBalancePopup(flag: boolean) {
    this.refillBalanceData = {};
    this.showRefillBalancePopup = flag;
  }

  public openSendMoneyPopup(flag: boolean) {
    this.sendMoneyData = {};
    this.showSendMoneyPopup = flag;
  }

  public onToggleAllZero(): void {
    this.loadBalances(this.currTab);
  }
  public onToggleAllZeroMobile(hideAllZero: boolean): void {
    this.currentPage = 1;
    this.hideAllZero = hideAllZero;
    this.loadBalances(this.currTab);
  }


  public goToCryptoWithdrawPopup(balance: BalanceItem): void {
    this.popupService.demoPopupMessage = 1;
    this.popupService.showDemoTradingPopup(true);
    // this.showSendMoneyPopup = true;
    // this.sendMoneyData = {
    //   step: 2,
    //   stepName: CRYPTO_WITHDRAWAL,
    //   balance: balance
    // };
  }

  public goToCryptoDepositPopup(balance: BalanceItem): void {
    this.showRefillBalancePopup = true;
    this.refillBalanceData = {
      step: 2,
      stepName: CRYPTO_DEPOSIT,
      balance: balance
    };
  }

  public filterByCurrencyForMobile({currency, currTab}): void {
    this.currencyForChoose = currency;
    this.currentPage = 1;
    this.loadBalances(this.currTab);
  }

  public goToTransferPopup(balance: BalanceItem): void {
    this.popupService.demoPopupMessage = 1;
    this.popupService.showDemoTradingPopup(true);
    // this.showSendMoneyPopup = true;
    // this.sendMoneyData = {
    //   step: 2,
    //   stepName: INNER_TRANSFER,
    //   stepThreeData: balance
    // };
  }

  public loadMoreBalancesForMobile({currentPage, countPerPage, concat}): void {
    this.countPerPage = countPerPage;
    this.currentPage = currentPage;
    this.loadBalances(this.currTab, concat);
  }

  public onBuyCurrency(marketPair) {
    const splitName = marketPair.split('-');
    this.dashboardWS.isNeedChangeCurretPair = false;
    this.dashboardWS.findPairByCurrencyPairName(`${splitName[0]}/${splitName[1]}`);
    this.router.navigate(['/'], {queryParams: {widget: 'trading'}});
  }

  public onRevokePendingRequest({requestId, operation}): void {
    this.currentPage = 1;
    const params = {
      revoke: {
        requestId,
        operation,
      },
      loadPR: {
        offset: (this.currentPage - 1) * this.countPerPage,
        limit: this.countPerPage,
        concat: false,
      }
    }
    this.store.dispatch(new fundsAction.RevokePendingReqAction(params))
  }


  public onGoToBalanceDetails({currencyId, priceIn}) {
    this.router.navigate([`/funds/balances/${currencyId}`], {queryParams: {priceIn}})
  }






}
