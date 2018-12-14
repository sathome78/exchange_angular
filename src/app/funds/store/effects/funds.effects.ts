import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {map, switchMap, catchError} from 'rxjs/internal/operators';
import {of} from 'rxjs';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as fundsActions from '../actions/funds.actions';
import * as dashboardActions from '../../../dashboard/actions/dashboard.actions';
import {BalanceService} from 'app/funds/services/balance.service';
import {SetAllCurrenciesForChoose} from '../actions/funds.actions';
import {LoadAllCurrenciesForChoose} from '../actions/funds.actions';
import {LOAD_CRYPTO_CURRENCIES_FOR_CHOOSE} from '../actions/funds.actions';
import {LoadCryptoCurrenciesForChoose} from '../actions/funds.actions';
import {SetCryptoCurrenciesForChoose} from '../actions/funds.actions';
import {ChangeCurrencyPairAction} from '../../../dashboard/actions/dashboard.actions';
import {CurrencyPair} from '../../../model';


interface ResData {
  data: any;
  error: any;
}

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


  @Effect()
    loadAllCurrencies$: Observable<Action> = this.actions$
      .pipe(ofType<fundsActions.LoadAllCurrenciesForChoose>(fundsActions.LOAD_ALL_CURRENCIES_FOR_CHOOSE))
      .pipe(switchMap( () =>  {
        return this.balanceService.getCryptoFiatNames()
          .pipe(
            map(res => (new fundsActions.SetAllCurrenciesForChoose(res.data))),
            catchError(error => of(new fundsActions.FailLoadCurrenciesForChoose(error)))
          );
      }));

  @Effect()
  loadCryptoCurrencies$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.LoadCryptoCurrenciesForChoose>(fundsActions.LOAD_CRYPTO_CURRENCIES_FOR_CHOOSE))
    .pipe(switchMap( () =>  {
      return this.balanceService.getCryptoNames()
        .pipe(
          map(res => (new fundsActions.SetCryptoCurrenciesForChoose(res))),
          catchError(error => of(new fundsActions.FailLoadCurrenciesForChoose(error)))
        );
    }));

  @Effect()
  loadFiatCurrencies$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.LoadFiatCurrenciesForChoose>(fundsActions.LOAD_CRYPTO_CURRENCIES_FOR_CHOOSE))
    .pipe(switchMap( () =>  {
      return this.balanceService.getFiatNames()
        .pipe(
          map(res => (new fundsActions.SetFiatCurrenciesForChoose(res))),
          catchError(error => of(new fundsActions.FailLoadCurrenciesForChoose(error)))
        );
    }));


  @Effect()
  loadMaxCurrencyPair$: Observable<Action> = this.actions$
    .pipe(ofType<fundsActions.LoadMaxCurrencyPairByCurrencyName>(fundsActions.LOAD_MAX_CURRENCY_PAIR_BY_CURRENCY_NAME))
    .pipe(switchMap( (action) =>  {
      return this.balanceService.getMaxCurrencyPairByName(action.payload)
        .pipe(
          map(res => (new dashboardActions.ChangeCurrencyPairAction( (res as {data: any, error: any}).data ))),
          catchError(error => of(new fundsActions.FailLoadCurrenciesForChoose(error)))
        );
    }));
}
