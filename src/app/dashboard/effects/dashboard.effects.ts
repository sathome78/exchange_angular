import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as dashboard from '../actions/dashboard.actions';

import {catchError, map, switchMap} from 'rxjs/internal/operators';
import * as dashboardActions from '../../dashboard/actions/dashboard.actions';
import {of} from 'rxjs';
import {defaultOrderItem} from '../reducers/default-values';

@Injectable()
export class DashboardEffects {

  /**
   * Set current currency pair
   */
  @Effect()
  setCurrencyPair$: Observable<Action> = this.actions$
    .pipe(ofType(dashboard.CHANGE_CURRENCY_PAIR))
    // .pipe(map(action =>  ))


  /**
   * Default constructor
   *
   * @param actions$§
   */
  constructor(private actions$: Actions) {
  }
}
