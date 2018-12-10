import * as fromActions from '../actions/funds.actions';
import {defaultValues} from './default-values';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {OrderCurrencyPair} from 'app/orders/models/order-currency-pair';
import {BalanceItem} from 'app/funds/models/balance-item.model';

export interface State {
  cryptoBal: BalanceItem[];
  countCryptoBal: number;
  loading: boolean;
  // historyOrders: BalanceItem[];
  // countHistoryOrders: number;
  // currencyPairs: OrderCurrencyPair[];
}

export const INIT_STATE: State = {
  cryptoBal: defaultValues.cryptoBal,
  countCryptoBal: defaultValues.countCryptoBal,
  // historyOrders: defaultValues.historyOrders,
  // countHistoryOrders: defaultValues.countHistoryOrders,
  // currencyPairs: defaultValues.currencyPairs,
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

    // case ordersActions.LOAD_HISTORY_ORDERS:
    //   return {...state, loading: true};
    // case ordersActions.SET_HISTORY_ORDERS:
    //   return {
    //     ...state, 
    //     loading: false, 
    //     historyOrders: action.payload.historyOrders, 
    //     countHistoryOrders: action.payload.count,
    //   };
    // case ordersActions.FAIL_LOAD_HISTORY_ORDERS:
    //   return {
    //     ...state, 
    //     loading: false, 
    //   };

    
    // case ordersActions.SET_CURRENCY_PAIRS_ORDERS:
    //   return {
    //     ...state, 
    //     currencyPairs: action.payload.currencyPairs, 
    //   };

    default :
      return state;
  }
}

export const getOrdersState = createFeatureSelector<State>('funds');

/** Crypto balances start */

export const getCryptoBalances = (state: State): BalanceItem[] => state.cryptoBal;
export const getCountCryptoBal = (state: State): number => state.countCryptoBal;

export const getCryptoBalancesSelector = createSelector(getOrdersState, getCryptoBalances);
export const getCountCryptoBalSelector = createSelector(getOrdersState, getCountCryptoBal);

// /** Open orders finish */

// /** History orders start */
// /** Simple selectors */
// export const getHistoryOrdersSelectorFilterCurr = (state: State): OrderItem[] => state.historyOrders;
// export const getHistoryOrdersCountSelector = (state: State): number => state.countHistoryOrders;

// /** Selector returns count of open orders */
// export const getHistoryOrdersCount = createSelector(
//   getOrdersState,
//   getHistoryOrdersCountSelector,
// );

// /** Selector returns array of open orders filtered by currency*/
// export const getHistoryOrdersFilterCurr = createSelector(
//   getOrdersState,
//   getHistoryOrdersSelectorFilterCurr,
// );

// /** History orders finish */

// /** Orders currencies pairs start */

// // export const getAllCurrencyPairsSelector = (state: State): OrderCurrencyPair[] => state.currencyPairs;
// export const getAllCurrencyPairs = (state: State): OrderCurrencyPair[] => state.currencyPairs;

// /** Selector returns array of open orders filtered by currency*/
// export const getAllCurrencyPairsSelector = createSelector(
//   getOrdersState,
//   getAllCurrencyPairs
// );

// /** Orders currencies pairs finish */