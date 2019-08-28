import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/internal/operators';
import * as dashboardActions from '../actions/dashboard.actions';
import { of } from 'rxjs';
import { EmbeddedOrdersService } from '../components/embedded-orders/embedded-orders.service';

@Injectable()
export class DashboardEffects {
  /**
   * Default constructor
   *
   * @param actions$
   */
  constructor(private actions$: Actions, private ordersService: EmbeddedOrdersService) {}


  /**
   * Load history orders
   */
  @Effect()
  loadHistoryOrdersDashboard$: Observable<Action> = this.actions$
    .pipe(ofType<dashboardActions.LoadHistoryOrdersAction>(dashboardActions.LOAD_HISTORY_ORDERS))
    .pipe(
      switchMap(action => {
        return this.ordersService.getHistory(action.payload, 'CLOSED').pipe(
          map(orders => {
            return new dashboardActions.SetHistoryOrdersAction({
              historyOrders: orders.items,
              count: orders.count,
            });
          }),
          catchError(error => of(new dashboardActions.FailHistoryOrdersAction(error)))
        );
      })
    );
}
