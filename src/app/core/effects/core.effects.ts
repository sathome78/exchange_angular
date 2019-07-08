import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Action, Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {map, switchMap, catchError, withLatestFrom} from "rxjs/internal/operators";

import * as coreActions from '../actions/core.actions';
import * as mainSelectors from '../reducers';
import {State} from '../reducers/index';
import {CoreService} from '../services/core.service';
import {of} from 'rxjs';
import {SettingsService} from '../../settings/settings.service';

@Injectable()
export class CoreEffects {
/*
  /!**
   * Saves user's auth token to localStorage
   *!/
  @Effect({dispatch: false})
  setToken: Observable<void> = this.actions$.ofType(core.SAVE_TOKEN)
    .pipe(map(action => localStorage.setItem('TOKEN', action.payload)));*/


  /**
   * Default constructor
   * @param actions$§
   */
  constructor(
    private actions$: Actions,
    private coreService: CoreService,
    private store: Store<State>,
    private settingsService: SettingsService,
  ) {
  }

  /**
   * Load currency pairs
   */
  @Effect()
  loadSimpleCurrencyPairs$: Observable<Action> = this.actions$
    .pipe(ofType<coreActions.LoadCurrencyPairsAction>(coreActions.LOAD_SIMPLE_CURRENCY_PAIRS))
    .pipe(withLatestFrom(
      this.store.select(mainSelectors.getSimpleCurrencyPairsSelector),
      (action: any, store:any) => store
    ))
    .pipe(switchMap((list) => {
      if (list.length) {
        return of(new coreActions.SetCurrencyPairsAction({
          simpleItems: list.map(({id, name}) => ({id, name})),
          detailedItems: list,
        }));
      }
      return this.coreService.getSimpleCurrencyPairs()
        .pipe(
          map(pairs => (new coreActions.SetCurrencyPairsAction({
            simpleItems: pairs.map(({id, name}) => ({id, name})),
            detailedItems: pairs,
          }))),
          catchError(error => of(new coreActions.FailLoadCurrencyPairsAction(error)))
        )
    }))

  @Effect()
  loadAllCurrencies$: Observable<Action> = this.actions$
    .pipe(ofType<coreActions.LoadAllCurrenciesForChoose>(coreActions.LOAD_ALL_CURRENCIES_FOR_CHOOSE))
    .pipe(withLatestFrom(
      this.store.select(mainSelectors.getAllCurrenciesForChoose),
      (action: any, store:any) => store
    ))
    .pipe(switchMap((list) => {
      if (list.length) {
        return of(new coreActions.SetAllCurrenciesForChoose(list));
      }
      return this.coreService.getCryptoFiatNames()
        .pipe(
          map(res => (new coreActions.SetAllCurrenciesForChoose(res.data))),
          catchError(error => of(new coreActions.FailLoadCurrenciesForChoose(error)))
        );
    }));

  @Effect()
  loadCryptoCurrencies$: Observable<Action> = this.actions$
    .pipe(ofType<coreActions.LoadCryptoCurrenciesForChoose>(coreActions.LOAD_CRYPTO_CURRENCIES_FOR_CHOOSE))
    .pipe(withLatestFrom(
      this.store.select(mainSelectors.getCryptoCurrenciesForChoose),
      (action: any, store:any) => store
    ))
    .pipe(switchMap((list) => {
      if (list.length) {
        return of(new coreActions.SetCryptoCurrenciesForChoose(list));
      }
      return this.coreService.getCryptoNames()
        .pipe(
          map(res => (new coreActions.SetCryptoCurrenciesForChoose(res))),
          catchError(error => of(new coreActions.FailLoadCurrenciesForChoose(error)))
        );
    }));

  @Effect()
  loadFiatCurrencies$: Observable<Action> = this.actions$
    .pipe(ofType<coreActions.LoadFiatCurrenciesForChoose>(coreActions.LOAD_FIAT_CURRENCIES_FOR_CHOOSE))
    .pipe(withLatestFrom(
      this.store.select(mainSelectors.getFiatCurrenciesForChoose),
      (action: any, store:any) => store
    ))
    .pipe(switchMap((list) => {
      if (list.length) {
        return of(new coreActions.SetFiatCurrenciesForChoose(list));
      }
      return this.coreService.getFiatNames()
        .pipe(
          map(res => (new coreActions.SetFiatCurrenciesForChoose(res))),
          catchError(error => of(new coreActions.FailLoadCurrenciesForChoose(error)))
        );
    }));

  @Effect()
  loadVerificationStatus$: Observable<Action> = this.actions$
    .pipe(ofType<coreActions.LoadVerificationStatusAction>(coreActions.LOAD_VERIFICATION_STATUS))
    .pipe(switchMap(() => {
      return this.settingsService.getCurrentVerificationStatusKYC()
        .pipe(
          map(res => new coreActions.SetVerificationStatusAction(res.data)),
          catchError(error => of(new coreActions.FailLoadVerificationStatusAction(error)))
        );
    }));
  
  @Effect()
    loadQuberaBankStatus$: Observable<Action> = this.actions$
      .pipe(ofType<coreActions.LoadQuberaBankStatusAction>(coreActions.LOAD_BANK_QUBERA_STATUS))
      .pipe(switchMap(() => {
        return this.settingsService.getCurrentQuberaBankStatusKYC()
          .pipe(
            map(res => new coreActions.SetQuberaBankStatusAction(res.data)),
            catchError(error => of(new coreActions.FailLoadQuberaBankStatusAction(error)))
          );
      }));
}
