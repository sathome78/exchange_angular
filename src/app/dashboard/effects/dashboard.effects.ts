import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {Actions, Effect} from '@ngrx/effects';

import * as dashboard from '../actions/dashboard.actions';
import {map} from 'rxjs/internal/operators';

@Injectable()
export class DashboardEffects {

  /**
   * Set current currency pair
   */
  @Effect()
  setCurrencyPair$: Observable<Action> = this.actions$.ofType(dashboard.CHANGE_CURRENCY_PAIR)

  /**
   * Default constructor
   *
   * @param actions$§
   */
  constructor(private actions$: Actions) {
  }
}
