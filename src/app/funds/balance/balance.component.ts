
import {Component, OnDestroy, OnInit, Input} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {Store, select} from '@ngrx/store';
import * as fundsReducer from '../store/reducers/funds.reducer';
import * as fundsAction from '../store/actions/funds.actions';
import {BalanceItem} from '../models/balance-item.model';
import {PendingRequestsItem} from '../models/pending-requests-item.model';

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

  public cryptoBalances$: Observable<BalanceItem[]>;
  public countOfCryptoEntries$: Observable<number>;
  public fiatBalances$: Observable<BalanceItem[]>;
  public countOfFiatEntries$: Observable<number>;
  public pendingRequests$: Observable<PendingRequestsItem[]>;
  public countOfPendingRequests$: Observable<number>;

  public currentPage = 1;
  public countPerPage = 15;
  public excludeZero: boolean = false;
 
  constructor(private store: Store<fundsReducer.State>) {
    this.cryptoBalances$ = store.pipe(select(fundsReducer.getCryptoBalancesSelector));
    this.countOfCryptoEntries$ = store.pipe(select(fundsReducer.getCountCryptoBalSelector));
    this.fiatBalances$ = store.pipe(select(fundsReducer.getFiatBalancesSelector));
    this.countOfFiatEntries$ = store.pipe(select(fundsReducer.getCountFiatBalSelector));
    this.pendingRequests$ = store.pipe(select(fundsReducer.getPendingRequestsSelector));
    this.countOfPendingRequests$ = store.pipe(select(fundsReducer.getCountPendingReqSelector));
  }

  ngOnInit() {
    this.loadBalances(this.currTab);
    this.loadBalances(this.Tab.PR); 
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
          type,
          offset: (this.currentPage - 1) * this.countPerPage, 
          limit: this.countPerPage,
          hideCanceled: this.excludeZero,
        }
        return this.store.dispatch(new fundsAction.LoadCryptoBalAction(paramsC));
      case this.Tab.FIAT :
        const paramsF = {
          type,
          offset: (this.currentPage - 1) * this.countPerPage, 
          limit: this.countPerPage,
          hideCanceled: this.excludeZero,
        }
        return this.store.dispatch(new fundsAction.LoadFiatBalAction(paramsF));
      case this.Tab.PR :
        const paramsP = {
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
    // this.ngUnsubscribe.next();
    // this.ngUnsubscribe.complete();
  }

  public openRefillBalancePopup(flag: boolean) {
    this.showRefillBalancePopup = flag;
  }

  public openSendMoneyPopup(flag: boolean) {
    this.showSendMoneyPopup = flag;
  }

}
