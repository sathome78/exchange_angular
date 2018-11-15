import * as dashboard from '../actions/dashboard.actions';
import {CurrencyPair} from '../../model/currency-pair.model';
import {UserBalance} from '../../model/user-balance.model';
import {defaultUserBalance, defaultValues} from './default-values';

export interface State {
  currencyPair: CurrencyPair;
  currencyPairArray: CurrencyPair[];
  userBalance: UserBalance;
}

export const INIT_STATE: State = {
  currencyPair: defaultValues as CurrencyPair,
  currencyPairArray: [],
  userBalance: defaultUserBalance
};

/**
 * Exports reducing function
 * @param state
 * @param action
 */
export function reducer(state: State = INIT_STATE, action: dashboard.Actions) {
  switch (action.type) {
    case dashboard.CHANGE_CURRENCY_PAIR:
      console.log(action.payload);
      return {...state, currencyPair: action.payload};
    case dashboard.LOAD_CURRENCY_PAIRS:
      return {...state, currencyPairArray: action.payload};

    default :
      return state;
  }
}

/**
 * Selector returns current currency pair
 */
export const getCurrencyPair = (state: State): CurrencyPair => state.currencyPair;

/**
 * Selector returns array of currency pairs
 */
export const getCurrencyPairArray = (state: State): CurrencyPair[] => state.currencyPairArray;

/**
 * Selector returns current user balance
 */
export const getUserBalance = (state: State): UserBalance => state.userBalance;
