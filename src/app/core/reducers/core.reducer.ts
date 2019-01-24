import * as coreActions from '../actions/core.actions';
import {ActionReducer, createSelector} from '@ngrx/store';
import {REHYDRATE, RehydrateAction} from '../actions/core.actions';
import { SimpleCurrencyPair } from '../models/simple-currency-pair';
import { CurrencyChoose } from '../models/currency-choose.model';

export interface State {
  currency: string;
  region: string;
  language: string;
  simpleCurrencyPairs: SimpleCurrencyPair[];
  cryptoCurrenciesForChoose: CurrencyChoose[];
  fiatCurrenciesForChoose: CurrencyChoose[];
  allCurrenciesForChoose: CurrencyChoose[];
  loading: false;
}

export const INIT_STATE: State = {
  currency: null,
  region: null,
  language: 'en',
  simpleCurrencyPairs: [],
  cryptoCurrenciesForChoose: [],
  fiatCurrenciesForChoose: [],
  allCurrenciesForChoose: [],
  loading: false,
};

/**
 * Exports reducing function
 * @param state
 * @param action
 */
export function reducer(state: State = INIT_STATE, action: coreActions.Actions) {
  switch (action.type) {
    case coreActions.SAVE_COMPLETE:
      return {...state, ...action.payload};

    case coreActions.SAVE_TO_STORE:
      return {...state, ...action.payload};

    case coreActions.CHANGE_LANGUAGE:
      // console.log(action.payload)
      return {...state, language: action.payload};

    case coreActions.SET_SIMPLE_CURRENCY_PAIRS:
      return {
        ...state,
        simpleCurrencyPairs: action.payload.items,
      };

    case coreActions.LOAD_ALL_CURRENCIES_FOR_CHOOSE:
      return {...state, loading: true};
    case coreActions.LOAD_CRYPTO_CURRENCIES_FOR_CHOOSE:
      return {...state, loading: true};
    case coreActions.LOAD_FIAT_CURRENCIES_FOR_CHOOSE:
      return {...state, loading: true};
    case coreActions.SET_ALL_CURRENCIES_FOR_CHOOSE:
      return {...state, allCurrenciesForChoose: action.payload};
    case coreActions.SET_CRYPTO_CURRENCIES_FOR_CHOOSE:
      return {...state, cryptoCurrenciesForChoose: action.payload};
    case coreActions.SET_FIAT_CURRENCIES_FOR_CHOOSE:
      return {...state, fiatCurrenciesForChoose: action.payload};
    case coreActions.FAIL_LOAD_CURRENCIES_FOR_CHOOSE:
      return {...state, loading: false};

    default :
      return state;
  }
}
/*

/!**
 * Meta reducer for rehydrating state
 * @param myReducer
 * @returns {(state:any, action:any)=>(any|any)}
 *!/
export function rehydrateState(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    if (action.type == REHYDRATE) {
      return {...(<RehydrateAction>action).payload, router : fromRouter.routerReducer};
    }
    return reducer(state, action);
  };
}
*/

/**
 * Selector returns current language
 */
export const getLanguage = (state: State): string => state.language;

/**
 * Selector returns current region
 */
export const getRegion = (state: State): string => state.region;


export const getAllSimpleCurrencyPairs = (state: State): SimpleCurrencyPair[] => state.simpleCurrencyPairs;
/** Selector returns crypto and fiat currencies for choose in dropdown*/
export const getAllCurrenciesForChoose = (state: State): CurrencyChoose[] => state.allCurrenciesForChoose;
/** Selector returns crypto currencies for choose in dropdown*/
export const getCryptoCurrenciesForChoose = (state: State): CurrencyChoose[] => state.cryptoCurrenciesForChoose;
/** Selector returns fiat currencies for choose in dropdown*/
export const getFiatCurrenciesForChoose = (state: State): CurrencyChoose[] => state.fiatCurrenciesForChoose;
