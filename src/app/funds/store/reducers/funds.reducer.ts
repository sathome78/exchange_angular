import * as fromActions from '../actions/funds.actions';
import {defaultValues} from './default-values';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {OrderCurrencyPair} from 'app/orders/models/order-currency-pair';
import {BalanceItem} from 'app/funds/models/balance-item.model';

export interface State {
  cryptoBal: BalanceItem[];
  countCryptoBal: number;
  fiatBal: BalanceItem[];
  countFiatBal: number;
  loading: boolean;
}

export const INIT_STATE: State = {
  cryptoBal: defaultValues.cryptoBal,
  countCryptoBal: defaultValues.countCryptoBal,
  fiatBal: defaultValues.fiatBal,
  countFiatBal: defaultValues.countFiatBal,
  loading: false,
};

/**
 * Exports reducing function
 * @param state
 * @param action
 */
export function reducer(state: State = INIT_STATE, action: fromActions.Actions) {
  switch (action.type) {
    case fromActions.LOAD_CRYPTO_BAL:
      return {...state, loading: true};
    case fromActions.SET_CRYPTO_BAL:
      return {
        ...state, 
        loading: false, 
        cryptoBal: action.payload.items, 
        countCryptoBal: action.payload.count,
      };
    case fromActions.FAIL_LOAD_CRYPTO_BAL:
      return {
        ...state, 
        loading: false, 
      };

    case fromActions.LOAD_FIAT_BAL:
      return {...state, loading: true};
    case fromActions.SET_FIAT_BAL:
      return {
        ...state, 
        loading: false, 
        fiatBal: action.payload.items, 
        countFiatBal: action.payload.count,
      };
    case fromActions.FAIL_LOAD_FIAT_BAL:
      return {
        ...state, 
        loading: false, 
      };

    default :
      return state;
  }
}

export const getOrdersState = createFeatureSelector<State>('funds');

/** Crypto balances */

export const getCryptoBalances = (state: State): BalanceItem[] => state.cryptoBal;
export const getCountCryptoBal = (state: State): number => state.countCryptoBal;

export const getCryptoBalancesSelector = createSelector(getOrdersState, getCryptoBalances);
export const getCountCryptoBalSelector = createSelector(getOrdersState, getCountCryptoBal);

/** Fiat balances */

export const getFiatBalances = (state: State): BalanceItem[] => state.fiatBal;
export const getCountFiatBal = (state: State): number => state.countFiatBal;

export const getFiatBalancesSelector = createSelector(getOrdersState, getFiatBalances);
export const getCountFiatBalSelector = createSelector(getOrdersState, getCountFiatBal);

