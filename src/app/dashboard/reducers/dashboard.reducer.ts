import * as dashboard from '../actions/dashboard.actions';
import {CurrencyPair} from '../../model/currency-pair.model';
import {UserBalance} from '../../model/user-balance.model';
import {defaultCurrencyPairInfo, defaultOrderItem, defaultUserBalance, defaultValues} from './default-values';
import {OrderItem} from '../../model/order-item.model';
import {CurrencyPairInfo} from '../../model/currency-pair-info.model';
import {REFRESH_CURRENCY_PAIR_INFO} from '../actions/dashboard.actions';

export interface State {
  currencyPair: CurrencyPair;
  currencyPairArray: CurrencyPair[];
  userBalance: UserBalance;
  selectedOrderBookOrder: OrderItem;
  currencyPairInfo: CurrencyPairInfo;
}

export const INIT_STATE: State = {
  currencyPair: defaultValues as CurrencyPair,
  currencyPairArray: [],
  userBalance: defaultUserBalance,
  selectedOrderBookOrder: defaultOrderItem as OrderItem,
  currencyPairInfo: defaultCurrencyPairInfo
};

/**
 * Exports reducing function
 * @param state
 * @param action
 */
export function reducer(state: State = INIT_STATE, action: dashboard.Actions) {
  switch (action.type) {
    case dashboard.CHANGE_CURRENCY_PAIR:
      return {...state, currencyPair: action.payload};
    case dashboard.LOAD_CURRENCY_PAIRS:
      return {...state, currencyPairArray: action.payload};
    case  dashboard.REFRESH_USER_BALANCE:
      return {...state, userBalance: action.payload};
    case dashboard.SELECTED_ORDERBOOK_ORDER:
      return {...state, selectedOrderBookOrder: action.payload};
    case dashboard.REFRESH_CURRENCY_PAIR_INFO:
      return {...state, currencyPairInfo: action.payload};
    default :
      return state;
  }
}

/** Selector returns current currency pair*/
export const getCurrencyPair = (state: State): CurrencyPair => state.currencyPair;

/** Selector returns array of currency pairs */
export const getCurrencyPairArray = (state: State): CurrencyPair[] => state.currencyPairArray;

/** Selector returns current user balance */
export const getUserBalance = (state: State): UserBalance => state.userBalance;

/** Selector returns selected order-book order */
export const getSelectedOrderBookOrder = (state: State): OrderItem => state.selectedOrderBookOrder;

/** Selector returns currency pair info */
export const getCurrencyPairInfo = (state: State): CurrencyPairInfo => state.currencyPairInfo;
