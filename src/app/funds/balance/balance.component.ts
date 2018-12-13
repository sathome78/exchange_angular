
import {Component, OnDestroy, OnInit, Input} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {Store, select} from '@ngrx/store';
import * as fundsReducer from '../store/reducers/funds.reducer';
import * as fundsAction from '../store/actions/funds.actions';
import {BalanceItem} from '../models/balance-item.model';
import {PendingRequestsItem} from '../models/pending-requests-item.model';
import {MyBalanceItem} from '../models/my-balance-item.model';
import {BalanceCrypto} from '../../model';
import {BalanceService} from '../services/balance.service';
import {takeUntil} from 'rxjs/operators';
import {CRYPTO_DEPOSIT, CRYPTO_WITHDRAWAL} from './send-money/send-money-constants';

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
  }

  public balanceItems: BalanceItem [] = [];
  public currTab: string = this.Tab.CRYPTO;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public showRefillBalancePopup: boolean = false;
  public showSendMoneyPopup: boolean = false;
  public hideAllZero: boolean = false;
  public isMobile: boolean = false;

  public cryptoBalances$: Observable<BalanceItem[]>;
  public countOfCryptoEntries$: Observable<number>;
  public fiatBalances$: Observable<BalanceItem[]>;
  public countOfFiatEntries$: Observable<number>;
  public pendingRequests$: Observable<PendingRequestsItem[]>;
  public countOfPendingRequests$: Observable<number>;
  public myBalances$: Observable<MyBalanceItem>;
  public cryptoBalances: BalanceCrypto[];
  public sendMoneyData = {};
  public refillBalanceData = {};

  public currentPage = 1;
  public countPerPage = 15;
    
  constructor(
    public balanceService: BalanceService,
    private store: Store<fundsReducer.State>
  ) {
    this.cryptoBalances$ = store.pipe(select(fundsReducer.getCryptoBalancesSelector));
    this.countOfCryptoEntries$ = store.pipe(select(fundsReducer.getCountCryptoBalSelector));
    this.fiatBalances$ = store.pipe(select(fundsReducer.getFiatBalancesSelector));
    this.countOfFiatEntries$ = store.pipe(select(fundsReducer.getCountFiatBalSelector));
    this.pendingRequests$ = store.pipe(select(fundsReducer.getPendingRequestsSelector));
    this.countOfPendingRequests$ = store.pipe(select(fundsReducer.getCountPendingReqSelector));
    this.myBalances$ = store.pipe(select(fundsReducer.getMyBalancesSelector));
  }

  ngOnInit() {
    this.isMobile = window.innerWidth <= 1200
    this.loadBalances(this.currTab);
    this.loadBalances(this.Tab.PR); 
    this.store.dispatch(new fundsAction.LoadMyBalancesAction())
    this.balanceService.getCryptoFiatNames()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.store.dispatch(new fundsAction.SetAllCurrenciesForChoose(res.data));
    });

    this.balanceService.getCryptoNames()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.store.dispatch(new fundsAction.SetCryptoCurrenciesForChoose(res));
      });

    this.balanceService.getFiatNames()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.store.dispatch(new fundsAction.SetFiatCurrenciesForChoose(res));
      });

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

  public loadBalances(type) {
    switch(type) {
      case this.Tab.CRYPTO :
        const paramsC = {
          isMobile: this.isMobile,
          type,
          offset: (this.currentPage - 1) * this.countPerPage, 
          limit: this.countPerPage,
          excludeZero: this.hideAllZero,
        }
        return this.store.dispatch(new fundsAction.LoadCryptoBalAction(paramsC));
      case this.Tab.FIAT :
        const paramsF = {
          isMobile: this.isMobile,
          type,
          offset: (this.currentPage - 1) * this.countPerPage, 
          limit: this.countPerPage,
          excludeZero: this.hideAllZero,
        }
        return this.store.dispatch(new fundsAction.LoadFiatBalAction(paramsF));
      case this.Tab.PR :
        const paramsP = {
          isMobile: this.isMobile,
          offset: (this.currentPage - 1) * this.countPerPage, 
          limit: this.countPerPage,
        }
        return this.store.dispatch(new fundsAction.LoadPendingReqAction(paramsP));
    }
    
  }

  public getCountOfEntries() {
    switch(this.currTab) {
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

  
  public goToCryptoWithdrawPopup(balance: BalanceItem): void {
    this.showSendMoneyPopup = true;
    this.sendMoneyData = {
      step: 2,
      stepName: CRYPTO_WITHDRAWAL,
      balance: balance
    };
  }

  public goToCryptoDepositPopup(balance: BalanceItem) {
    this.showRefillBalancePopup = true;
    this.refillBalanceData = {
      step: 2,
      stepName: CRYPTO_DEPOSIT,
      balance: balance
    };
  }

}
