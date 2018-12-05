import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {map, switchMap, catchError} from 'rxjs/internal/operators';
import {of} from 'rxjs';
import {Actions, Effect, ofType} from '@ngrx/effects';

import {OrdersService} from '../../orders.service';
import * as ordersActions from '../actions/orders.actions';

@Injectable()
export class OrdersEffects {

  /**
  * Default constructor
  *
  * @param actions$
  */
  constructor(
    private actions$: Actions,
    private ordersService: OrdersService,
  ) {
  }

  /**
   * Load open orders
   */
  @Effect()
  loadOpenOrders$: Observable<Action> = this.actions$
    .pipe(ofType<ordersActions.LoadOpenOrdersAction>(ordersActions.LOAD_OPEN_ORDERS))
    .pipe(switchMap((action) => {
      const {page, limit, from, to, currencyPairId} = action.payload;
      return this.ordersService.getOpenOrders(page, limit, from, to, currencyPairId)
        .pipe(
          map(orders => (new ordersActions.SetOpenOrdersAction({openOrders: orders.items, count: orders.count}))),
          catchError(error => of(new ordersActions.FailLoadOpenOrdersAction(error)))
        )
    }))
  /**
   * Load history orders
   */
  @Effect()
  loadHistoryOrders$: Observable<Action> = this.actions$
    .pipe(ofType<ordersActions.LoadHistoryOrdersAction>(ordersActions.LOAD_HISTORY_ORDERS))
    .pipe(switchMap((action) => {
      const {page, limit, from, to, hideCanceled, currencyPairId} = action.payload;
      return this.ordersService.getClosedOrders(page, limit, from, to, hideCanceled, currencyPairId)
        .pipe(
          map(orders => (new ordersActions.SetHistoryOrdersAction({historyOrders: orders.items, count: orders.count}))),
          catchError(error => of(new ordersActions.FailLoadHistoryOrdersAction(error)))
        )
    }))


  /**
   * Load currency pairs
   */
  @Effect()
  loadCurrencyPairs$: Observable<Action> = this.actions$
    .pipe(ofType<ordersActions.LoadCurrencyPairsAction>(ordersActions.LOAD_CURRENCY_PAIRS_ORDERS))
    .pipe(switchMap((action) => {
      return this.ordersService.getCurrencyPairs()
        .pipe(
          map(pairs => (new ordersActions.SetCurrencyPairsAction({currencyPairs: pairs.map(({id, name}) => ({id, name}))}))),
          catchError(error => of(new ordersActions.FailLoadCurrencyPairsAction(error)))
        )
    }))

}
