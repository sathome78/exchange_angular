import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {map, switchMap, catchError} from 'rxjs/internal/operators';
import {of} from 'rxjs';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as fundsActions from '../actions/funds.actions';
import {BalanceService} from 'app/funds/services/balance.service';

@Injectable()
export class FundsEffects {

  /**
  * Default constructor
  *
  * @param actions$
  */
  constructor(
    private actions$: Actions,
    private balanceService: BalanceService,
  ) {
  }

  /**
   * Load crypto balances
   */
  @Effect()
  loadOpenOrders$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.LoadCryptoBalAction>(fundsActions.LOAD_CRYPTO_BAL))
    .pipe(switchMap((action) => {
      return this.balanceService.getCryptoBalances(action.payload)
        .pipe(
          map(bal => (new fundsActions.SetCryptoBalAction({items: bal.items, count: bal.count}))),
          catchError(error => of(new fundsActions.FailLoadCryptoBalAction(error)))
        )
    }))

}
