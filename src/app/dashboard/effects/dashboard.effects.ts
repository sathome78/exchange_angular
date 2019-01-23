import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, mergeMap} from 'rxjs/internal/operators';
import * as dashboardActions from '../../dashboard/actions/dashboard.actions';
import {of} from 'rxjs';
import {CurrencyPairInfoService} from '../components/currency-pair-info/currency-pair-info.service';

@Injectable()
export class DashboardEffects {

  /**
   * Default constructor
   *
   * @param actions$§
   */
  constructor(
    private actions$: Actions,
    private currencyPairInfoService: CurrencyPairInfoService,
  ) {
  }

  /**
   * Load currency pair info
   */
  @Effect()
  loadCurrencyPairInfo$: Observable<Action> = this.actions$
    .pipe(ofType<dashboardActions.LoadCurrencyPairInfoAction>(dashboardActions.LOAD_CURRENCY_PAIR_INFO))
    .pipe(switchMap((action) => {
      console.log(action)
      return this.currencyPairInfoService.getCurrencyPairInfo(action.payload)
        .pipe(
          map(info => (new dashboardActions.RefreshCurrencyPairInfoAction(info))),
          catchError(error => of(new dashboardActions.FailLoadCurrencyPairInfoAction(error)))
        )
    }))
}
