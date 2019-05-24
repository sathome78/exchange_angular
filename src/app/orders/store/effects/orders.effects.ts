import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store, select } from '@ngrx/store';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/internal/operators';
import { of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromCore from '../../../core/reducers';
import { OrdersService } from '../../orders.service';
import * as ordersActions from '../actions/orders.actions';
import { UserService } from 'app/shared/services/user.service';

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
    private store: Store<fromCore.State>,
    private userService: UserService,
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
            if (action.payload.concat) {
              return new ordersActions.SetMoreOpenOrdersAction({ openOrders: orders.items, count: orders.count });
            }
            return new ordersActions.SetOpenOrdersAction({ openOrders: orders.items, count: orders.count });
          }),
          catchError(error => of(new ordersActions.FailLoadOpenOrdersAction(error))),
        );
    }));

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
          map(orders => {
            if (action.payload.concat) {
              return new ordersActions.SetMoreHistoryOrdersAction({ historyOrders: orders.items, count: orders.count });
            }
            return new ordersActions.SetHistoryOrdersAction({ historyOrders: orders.items, count: orders.count });
          }),
          catchError(error => of(new ordersActions.FailLoadHistoryOrdersAction(error))),
        );
    }));
  /**
   * Load last history orders
   */
  @Effect()
  loadLastHistoryOrders$: Observable<Action> = this.actions$
    .pipe(ofType<ordersActions.LoadLastHistoryOrdersAction>(ordersActions.LOAD_LAST_HISTORY_ORDERS))
    .pipe(switchMap((action) => {
      return this.ordersService.getLastClosedOrders(action.payload)
        .pipe(
          map(orders => {
            return new ordersActions.SetHistoryOrdersAction({ historyOrders: orders.items, count: orders.count });
          }),
          catchError(error => of(new ordersActions.FailLoadHistoryOrdersAction(error))),
        );
    }));

  /**
   * Load open orders
   */
  @Effect()
  cancelOpenOrder$: Observable<Action> = this.actions$
    .pipe(ofType<ordersActions.CancelOrderAction>(ordersActions.CANCEL_OPEN_ORDER))
    .pipe(withLatestFrom(this.store.pipe(select(fromCore.getActiveCurrencyPair))))
    .pipe(switchMap(([action, activePair]) => {
      return this.ordersService.deleteOrder(action.payload.order)
        .pipe(
          map(() => {
            this.userService.getUserBalance(activePair);
            if (action.payload.loadOrders.isMobile) {
              return new ordersActions.CropCanceledOrderAction(action.payload.order.id);
            }
            return new ordersActions.LoadOpenOrdersAction(action.payload.loadOrders);
          }),
          catchError(error => of(new ordersActions.FailLoadOpenOrdersAction(error))),
        );
    }));

}
