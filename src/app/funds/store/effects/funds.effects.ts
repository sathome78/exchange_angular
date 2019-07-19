import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {map, switchMap, catchError, tap} from 'rxjs/internal/operators';
import {of} from 'rxjs';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as fundsActions from '../actions/funds.actions';
import {BalanceService} from '../../services/balance.service';
import {BalanceDetailsItem} from 'app/funds/models/balance-details-item.model';
import * as dashboardActions from '../../../dashboard/actions/dashboard.actions';
import {MyBalanceItem} from '../../../model/my-balance-item.model';
import {Location} from '@angular/common';
import { TransactionsService } from 'app/funds/services/transaction.service';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import {UtilsService} from 'app/shared/services/utils.service';


interface ResData {
  data: any;
  error: any;
}

@Injectable()
export class FundsEffects {

  constructor(
    private actions$: Actions,
    private balanceService: BalanceService,
    private utilsService: UtilsService,
    private transactionsService: TransactionsService,
    private location: Location,
  ) {
  }

  /**
   * Load crypto balances
   */
  @Effect()
  loadCryptoBalances$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.LoadCryptoBalAction>(fundsActions.LOAD_CRYPTO_BAL))
    .pipe(switchMap((action) => {
      return this.balanceService.getBalances(action.payload)
        .pipe(
          map(bal => {
            if(action.payload.concat) {
              return new fundsActions.SetMoreCryptoBalAction({items: bal.items, count: bal.count})
            }
            return new fundsActions.SetCryptoBalAction({items: bal.items, count: bal.count})
          }),
          catchError(error => of(new fundsActions.FailLoadCryptoBalAction(error)))
        )
    }))


  @Effect()
  loadMaxCurrencyPair$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.LoadMaxCurrencyPairByCurrencyName>(fundsActions.LOAD_MAX_CURRENCY_PAIR_BY_CURRENCY_NAME))
    .pipe(switchMap( (action) =>  {
      return this.balanceService.getMaxCurrencyPairByName(action.payload)
        .pipe(
          map((res: {data: any, error: any}) => {
            const newActivePair = new SimpleCurrencyPair(res.data.currencyPairId, res.data.currencyPairName);
            this.utilsService.saveActiveCurrencyPairToSS(newActivePair);
            return new dashboardActions.ChangeActiveCurrencyPairAction(newActivePair);
          }),
          catchError(error => of(new fundsActions.FailLoadMaxCurrencyPairByCurrencyName(error)))
        );
    }));
  /**
   * Load fiat balances
   */
  @Effect()
  loadFiatBalances$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.LoadFiatBalAction>(fundsActions.LOAD_FIAT_BAL))
    .pipe(switchMap((action) => {
      return this.balanceService.getBalances(action.payload)
        .pipe(
          map(bal => {
            if(action.payload.concat) {
              return new fundsActions.SetMoreFiatBalAction({items: bal.items, count: bal.count})
            }
            return new fundsActions.SetFiatBalAction({items: bal.items, count: bal.count})
          }),
          catchError(error => of(new fundsActions.FailLoadFiatBalAction(error)))
        )
    }))

   /**
   * Load pending requests
   */
  @Effect()
  loadPendingRequests$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.LoadPendingReqAction>(fundsActions.LOAD_PENDING_REQ))
    .pipe(switchMap((action) => {
      return this.balanceService.getPendingRequests(action.payload)
        .pipe(
          map(bal => {
            if(action.payload.concat) {
              return new fundsActions.SetMorePendingReqAction({items: bal.items, count: bal.count})
            }
            return new fundsActions.SetPendingReqAction({items: bal.items, count: bal.count})
          }),
          catchError(error => of(new fundsActions.FailLoadPendingReqAction(error)))
        )
    }))

   /**
   * Load my balances
   */
  @Effect()
  loadMyBalances$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.LoadMyBalancesAction>(fundsActions.LOAD_MY_BALANCES))
    .pipe(switchMap(() => {
      return this.balanceService.getMyBalances()
        .pipe(
          map((res: MyBalanceItem) => (new fundsActions.SetMyBalancesAction(res))),
          catchError(error => of(new fundsActions.FailLoadMyBalancesAction(error)))
        )
    }))

  /**
   * Load qubera balances
   */
  @Effect()
  loadQuberaBalances$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.LoadQuberaBalAction>(fundsActions.LOAD_QUBERA_BAL))
    .pipe(switchMap(() => {
      return this.balanceService.getQuberaBalancesInfo()
        .pipe(
          map((res: any) => (new fundsActions.SetQuberaBalAction(res))),
          catchError(error => of(new fundsActions.FailLoadQuberaBalAction(error)))
        );
    }))

  /**
   * Load qubera KYC status
   */
  @Effect()
  loadQuberaKycStatus$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.LoadQuberaKycStatusAction>(fundsActions.LOAD_QUBERA_KYC_STATUS))
    .pipe(switchMap(() => {
      return this.balanceService.getStatusKYC()
        .pipe(
          map((res: any) => (new fundsActions.SetQuberaKycStatusAction(res))),
          catchError(error => of(new fundsActions.FailLoadQuberaKycStatusAction(error)))
        );
    }))

   /**
   * Load balance confirmation info
   */
  @Effect()
  loadBalanceDet$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.LoadBalanceDetailsAction>(fundsActions.LOAD_BALANCE_DETAILS_INFO))
    .pipe(switchMap((action) => {
      return this.balanceService.getBalanceDetailsInfo(action.payload)
        .pipe(
          map((res: BalanceDetailsItem) => (new fundsActions.SetBalanceDetailsAction(res))),
          catchError(error => of(new fundsActions.FailLoadBalanceDetailsAction(error)))
        )
    }))

   /**
   * Revoke pending requests
   */
  @Effect()
  RevokePendingRequests$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.RevokePendingReqAction>(fundsActions.REVOKE_PENDING_REQ))
    .pipe(switchMap((action) => {
      return this.balanceService.revokePendingRequest(action.payload.revoke)
        .pipe(
          map(() => new fundsActions.LoadPendingReqAction(action.payload.loadPR)),
          catchError(error => of(new fundsActions.FailRevokePendingReqAction(error)))
        )
    }))

   /**
   * Revoke pending requests for mobile screen
   */
  @Effect()
  RevokePendingRequestsMobile$:any = this.actions$
    .pipe(ofType<fundsActions.RevokePendingReqMobileAction>(fundsActions.REVOKE_PENDING_REQ_MOBILE))
    .pipe(switchMap((action) => {
      return this.balanceService.revokePendingRequest(action.payload)
        .pipe(
          tap(() => this.location.back()),
          catchError(error => of(new fundsActions.FailRevokePendingReqAction(error)))
        )
    }))


  /**
   * Load transactions history
   */
  @Effect()
  loadHistoryTransactions$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.LoadTransactionsHistoryAction>(fundsActions.LOAD_TRANSACTIONS_HISTORY))
    .pipe(switchMap((action) => {
      return this.transactionsService.getTransactionsHistory(action.payload)
        .pipe(
          map(orders => {
            if(action.payload.concat) {
              return new fundsActions.SetMoreTransactionsHistoryAction({items: orders.items, count: orders.count})
            }
            return new fundsActions.SetTransactionsHistoryAction({items: orders.items, count: orders.count})
          }),
          catchError(error => of(new fundsActions.FailLoadTransactionsHistoryAction(error)))
        )
    }))
  @Effect()
  loadLastHistoryTransactions$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.LoadLastTransactionsHistoryAction>(fundsActions.LOAD_LAST_TRANSACTIONS_HISTORY))
    .pipe(switchMap((action) => {
      return this.transactionsService.getLastTransactionsHistory(action.payload)
        .pipe(
          map(orders => new fundsActions.SetTransactionsHistoryAction({items: orders.items, count: orders.count})),
          catchError(error => of(new fundsActions.FailLoadTransactionsHistoryAction(error)))
        )
    }))

    @Effect()
    loadQuberaBankStatus$: Observable<Action> = this.actions$
      .pipe(ofType<fundsActions.LoadQuberaBankStatusAction>(fundsActions.LOAD_BANK_QUBERA_STATUS))
      .pipe(switchMap(() => {
        return this.balanceService.checkQuberaAccount('EUR')
          .pipe(
            map((res: any) => new fundsActions.SetQuberaBankStatusAction(res.data)),
            catchError(error => of(new fundsActions.FailLoadQuberaBankStatusAction(error)))
          );
      }));


}
