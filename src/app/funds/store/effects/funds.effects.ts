import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {map, switchMap, catchError} from 'rxjs/internal/operators';
import {of} from 'rxjs';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as fundsActions from '../actions/funds.actions';
import {BalanceService} from '../../services/balance.service';
import {BalanceDetailsItem} from 'app/funds/models/balance-details-item.model';
import * as dashboardActions from '../../../dashboard/actions/dashboard.actions';
import {SetAllCurrenciesForChoose} from '../actions/funds.actions';
import {LoadAllCurrenciesForChoose} from '../actions/funds.actions';
import {LOAD_CRYPTO_CURRENCIES_FOR_CHOOSE} from '../actions/funds.actions';
import {LoadCryptoCurrenciesForChoose} from '../actions/funds.actions';
import {SetCryptoCurrenciesForChoose} from '../actions/funds.actions';
import {ChangeCurrencyPairAction} from '../../../dashboard/actions/dashboard.actions';
import {CurrencyPair} from '../../../model';
import {MyBalanceItem} from '../../models/my-balance-item.model';


interface ResData {
  data: any;
  error: any;
}

@Injectable()
export class FundsEffects {

  constructor(
    private actions$: Actions,
    private balanceService: BalanceService,
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
    loadAllCurrencies$: Observable<Action> = this.actions$
      .pipe(ofType<fundsActions.LoadAllCurrenciesForChoose>(fundsActions.LOAD_ALL_CURRENCIES_FOR_CHOOSE))
      .pipe(switchMap( () =>  {
        return this.balanceService.getCryptoFiatNames()
          .pipe(
            map(res => (new fundsActions.SetAllCurrenciesForChoose(res.data))),
            catchError(error => of(new fundsActions.FailLoadCurrenciesForChoose(error)))
          );
      }));

  @Effect()
  loadCryptoCurrencies$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.LoadCryptoCurrenciesForChoose>(fundsActions.LOAD_CRYPTO_CURRENCIES_FOR_CHOOSE))
    .pipe(switchMap( () =>  {
      return this.balanceService.getCryptoNames()
        .pipe(
          map(res => (new fundsActions.SetCryptoCurrenciesForChoose(res))),
          catchError(error => of(new fundsActions.FailLoadCurrenciesForChoose(error)))
        );
    }));

  @Effect()
  loadFiatCurrencies$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.LoadFiatCurrenciesForChoose>(fundsActions.LOAD_CRYPTO_CURRENCIES_FOR_CHOOSE))
    .pipe(switchMap( () =>  {
      return this.balanceService.getFiatNames()
        .pipe(
          map(res => (new fundsActions.SetFiatCurrenciesForChoose(res))),
          catchError(error => of(new fundsActions.FailLoadCurrenciesForChoose(error)))
        );
    }));


  @Effect()
  loadMaxCurrencyPair$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.LoadMaxCurrencyPairByCurrencyName>(fundsActions.LOAD_MAX_CURRENCY_PAIR_BY_CURRENCY_NAME))
    .pipe(switchMap( (action) =>  {
      return this.balanceService.getMaxCurrencyPairByName(action.payload)
        .pipe(
          map(res => (new dashboardActions.ChangeCurrencyPairAction( (res as {data: any, error: any}).data ))),
          catchError(error => of(new fundsActions.FailLoadCurrenciesForChoose(error)))
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
          map(() => {
            return new fundsActions.LoadPendingReqAction(action.payload.loadPR)
          }),
          catchError(error => of(new fundsActions.FailRevokePendingReqAction(error)))
        )
    }))

}
