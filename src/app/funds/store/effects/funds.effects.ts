import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {map, switchMap, catchError} from 'rxjs/internal/operators';
import {of} from 'rxjs';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as fundsActions from '../actions/funds.actions';
import {FundsService} from '../../funds.service';

@Injectable()
export class FundsEffects {

  /**
  * Default constructor
  *
  * @param actions$
  */
  constructor(
    private actions$: Actions,
    private fundsService: FundsService,
  ) {
  }

  /**
   * Load crypto balances
   */
  @Effect()
  loadOpenOrders$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.LoadCryptoBalAction>(fundsActions.LOAD_CRYPTO_BAL))
    .pipe(switchMap((action) => {
      return this.fundsService.getCryptoBalances(action.payload)
        .pipe(
          map(bal => (new fundsActions.SetCryptoBalAction({items: bal.items, count: bal.count}))),
          catchError(error => of(new fundsActions.FailLoadCryptoBalAction(error)))
        )
    }))
  // /**
  //  * Load history orders
  //  */
  // @Effect()
  // loadHistoryOrders$: Observable<Action> = this.actions$
  //   .pipe(ofType<ordersActions.LoadHistoryOrdersAction>(ordersActions.LOAD_HISTORY_ORDERS))
  //   .pipe(switchMap((action) => {
  //     const {page, limit, from, to, hideCanceled, currencyPairId} = action.payload;
  //     return this.ordersService.getClosedOrders(page, limit, from, to, hideCanceled, currencyPairId)
  //       .pipe(
  //         map(orders => (new ordersActions.SetHistoryOrdersAction({historyOrders: orders.items, count: orders.count}))),
  //         catchError(error => of(new ordersActions.FailLoadHistoryOrdersAction(error)))
  //       )
  //   }))


  // /**
  //  * Load currency pairs
  //  */
  // @Effect()
  // loadCurrencyPairs$: Observable<Action> = this.actions$
  //   .pipe(ofType<ordersActions.LoadCurrencyPairsAction>(ordersActions.LOAD_CURRENCY_PAIRS_ORDERS))
  //   .pipe(switchMap((action) => {
  //     return this.ordersService.getCurrencyPairs()
  //       .pipe(
  //         map(pairs => (new ordersActions.SetCurrencyPairsAction({currencyPairs: pairs.map(({id, name}) => ({id, name}))}))),
  //         catchError(error => of(new ordersActions.FailLoadCurrencyPairsAction(error)))
  //       )
  //   }))

}
