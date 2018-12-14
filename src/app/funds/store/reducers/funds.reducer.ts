import * as fromActions from '../actions/funds.actions';
import {defaultValues} from './default-values';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {OrderCurrencyPair} from 'app/orders/models/order-currency-pair';
import {BalanceItem} from 'app/funds/models/balance-item.model';
import {CurrencyChoose} from '../../models/currency-choose.model';
import * as dashboard from '../../../dashboard/actions/dashboard.actions';
import {SET_ALL_CURRENCIES_FOR_CHOOSE} from '../actions/funds.actions';
import {SET_CRYPTO_CURRENCIES_FOR_CHOOSE} from '../actions/funds.actions';
import {SET_FIAT_CURRENCIES_FOR_CHOOSE} from '../actions/funds.actions';
import {CurrencyPair} from '../../../model/currency-pair.model';
import {FAIL_LOAD_CURRENCIES_FOR_CHOOSE} from '../actions/funds.actions';
import {LOAD_CRYPTO_CURRENCIES_FOR_CHOOSE} from '../actions/funds.actions';
import {LOAD_FIAT_CURRENCIES_FOR_CHOOSE} from '../actions/funds.actions';

export interface State {
  cryptoBal: BalanceItem[];
  countCryptoBal: number;
  loading: boolean;
  cryptoCurrenciesForChoose: CurrencyChoose[];
  fiatCurrenciesForChoose: CurrencyChoose[];
  allCurrenciesForChoose: CurrencyChoose[];
  // historyOrders: BalanceItem[];
  // countHistoryOrders: number;
  // currencyPairs: OrderCurrencyPair[];
}

export const INIT_STATE: State = {
  cryptoBal: defaultValues.cryptoBal,
  countCryptoBal: defaultValues.countCryptoBal,
  cryptoCurrenciesForChoose: [],
  fiatCurrenciesForChoose: [],
  allCurrenciesForChoose: [],
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
    case fromActions.LOAD_ALL_CURRENCIES_FOR_CHOOSE:
      return {...state, loading: true};
    case fromActions.LOAD_CRYPTO_CURRENCIES_FOR_CHOOSE:
      return {...state, loading: true};
    case fromActions.LOAD_FIAT_CURRENCIES_FOR_CHOOSE:
      return {...state, loading: true};
      case fromActions.SET_ALL_CURRENCIES_FOR_CHOOSE:
      return {...state, allCurrenciesForChoose: action.payload};
    case fromActions.SET_CRYPTO_CURRENCIES_FOR_CHOOSE:
      return {...state, cryptoCurrenciesForChoose: action.payload};
    case fromActions.SET_FIAT_CURRENCIES_FOR_CHOOSE:
      return {...state, fiatCurrenciesForChoose: action.payload};
      case fromActions.FAIL_LOAD_CURRENCIES_FOR_CHOOSE:
      return {...state, loading: false};

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


/** Selector returns crypto and fiat currencies for choose in dropdown*/
export const getAllCurrenciesForChoose = (state: State): CurrencyChoose[] => state.allCurrenciesForChoose;
/** Selector returns crypto and fiat currencies for choose in dropdown*/
export const getCryptoCurrenciesForChoose = (state: State): CurrencyChoose[] => state.cryptoCurrenciesForChoose;
/** Selector returns crypto and fiat currencies for choose in dropdown*/
export const getFiatCurrenciesForChoose = (state: State): CurrencyChoose[] => state.fiatCurrenciesForChoose;
