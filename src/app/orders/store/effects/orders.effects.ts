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
      return this.ordersService.getOpenOrders(action.payload)
        .pipe(
          map(orders => {
            if(action.payload.concat) {
              return new ordersActions.SetMoreOpenOrdersAction({openOrders: orders.items, count: orders.count})
            }
            return new ordersActions.SetOpenOrdersAction({openOrders: orders.items, count: orders.count})
          }),
          catchError(error => of(new ordersActions.FailLoadOpenOrdersAction(error)))
        )
    }))

    // if(action.payload.concat) {
    //   return new fundsActions.SetMoreCryptoBalAction({items: bal.items, count: bal.count})
    // }
    // return new fundsActions.SetCryptoBalAction({items: bal.items, count: bal.count})
  /**
   * Load history orders
   */
  @Effect()
  loadHistoryOrders$: Observable<Action> = this.actions$
    .pipe(ofType<ordersActions.LoadHistoryOrdersAction>(ordersActions.LOAD_HISTORY_ORDERS))
    .pipe(switchMap((action) => {
      return this.ordersService.getClosedOrders(action.payload)
        .pipe(
          map(response => {
            const orders = response.body;
            const isLast15Items = response.status === 207;
            if(action.payload.concat) {
              return new ordersActions.SetMoreHistoryOrdersAction({historyOrders: orders.items, count: orders.count, isLast15Items})
            }
            return new ordersActions.SetHistoryOrdersAction({historyOrders: orders.items, count: orders.count, isLast15Items})
          }),
          catchError(error => of(new ordersActions.FailLoadHistoryOrdersAction(error)))
        )
    }))

  /**
   * Load open orders
   */
  @Effect()
  cancelOpenOrder$: Observable<Action> = this.actions$
    .pipe(ofType<ordersActions.CancelOrderAction>(ordersActions.CANCEL_OPEN_ORDER))
    .pipe(switchMap((action) => {
      return this.ordersService.deleteOrder(action.payload.order)
        .pipe(
          map(() => {
            if (action.payload.loadOrders.isMobile) {
              return new ordersActions.CropCanceledOrderAction(action.payload.order.id);
            }
            return new ordersActions.LoadOpenOrdersAction(action.payload.loadOrders)
          }),
          catchError(error => of(new ordersActions.FailLoadOpenOrdersAction(error)))
        )
    }))

}
