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
   * Set current currency pair
   */
  @Effect()
  loadOpenOrders$: Observable<Action> = this.actions$
    .pipe(ofType<ordersActions.LoadOpenOrdersAction>(ordersActions.LOAD_OPEN_ORDERS))
    .pipe(switchMap((action) => {
      const {page, limit, from, to} = action.payload;
      return this.ordersService.getOpenOrders(page, limit, from, to)
        .pipe(
          map(orders => (new ordersActions.SetOpenOrdersAction({openOrders: orders.items, count: orders.count}))),
          catchError(error => of(new ordersActions.FailLoadOpenOrdersAction(error)))
        )
    }))

}
