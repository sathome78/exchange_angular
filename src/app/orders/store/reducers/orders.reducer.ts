import * as ordersActions from '../actions/orders.actions';
import {defaultValues} from './default-values';
import {OrderItem} from '../../models/order-item.model';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import { OrderCurrencyPair } from 'app/orders/models/order-currency-pair';

export interface State {
  openOrders: OrderItem[];
  countOpenOrders: number;
  loading: boolean;
  historyOrders: OrderItem[];
  countHistoryOrders: number;
  currencyPairs: OrderCurrencyPair[];
}

export const INIT_STATE: State = {
  openOrders: defaultValues.openOrders,
  countOpenOrders: defaultValues.countOpenOrders,
  historyOrders: defaultValues.historyOrders,
  countHistoryOrders: defaultValues.countHistoryOrders,
  currencyPairs: defaultValues.currencyPairs,
  loading: false,
};

/**
 * Exports reducing function
 * @param state
 * @param action
 */
export function reducer(state: State = INIT_STATE, action: ordersActions.Actions) {
  switch (action.type) {
    case ordersActions.LOAD_OPEN_ORDERS:
      return {...state, loading: true};
    case ordersActions.SET_OPEN_ORDERS:
      return {
        ...state, 
        loading: false, 
        openOrders: action.payload.openOrders, 
        countOpenOrders: action.payload.count,
      };
    case ordersActions.SET_MORE_OPEN_ORDERS:
      return {
        ...state, 
        loading: false, 
        openOrders: [...state.openOrders, ...action.payload.openOrders], 
        countOpenOrders: action.payload.count,
      };
    case ordersActions.FAIL_LOAD_OPEN_ORDERS:
      return {
        ...state, 
        loading: false, 
      };

    case ordersActions.LOAD_HISTORY_ORDERS:
      return {...state, loading: true};
    case ordersActions.SET_HISTORY_ORDERS:
      return {
        ...state, 
        loading: false, 
        historyOrders: action.payload.historyOrders, 
        countHistoryOrders: action.payload.count,
      };
    case ordersActions.SET_MORE_HISTORY_ORDERS:
      return {
        ...state, 
        loading: false, 
        historyOrders: [...state.historyOrders, ...action.payload.historyOrders], 
        countHistoryOrders: action.payload.count,
      };
    case ordersActions.FAIL_LOAD_HISTORY_ORDERS:
      return {
        ...state, 
        loading: false, 
      };

    
    case ordersActions.SET_CURRENCY_PAIRS_ORDERS:
      return {
        ...state, 
        currencyPairs: action.payload.currencyPairs, 
      };

    case ordersActions.CROP_CANCELED_ORDER:
      return {
        ...state, 
        openOrders: state.openOrders.filter((item) => item.id !== action.payload)
      };
    case ordersActions.FAIL_ORDERS:
      return {
        ...state, 
        loading: false, 
      };

    default :
      return state;
  }
}

export const getOrdersState = createFeatureSelector<State>('orders');

/** Open orders start */
/** Simple selectors */
export const getOpenOrdersSelectorFilterCurr = (state: State): OrderItem[] => state.openOrders;
export const getOpenOrdersCountSelector = (state: State): number => state.countOpenOrders;

/** Selector returns count of open orders */
export const getOpenOrdersCount = createSelector(
  getOrdersState,
  getOpenOrdersCountSelector,
);

/** Selector returns array of open orders filtered by currency*/
export const getOpenOrdersFilterCurr = createSelector(
  getOrdersState,
  getOpenOrdersSelectorFilterCurr,
);

/** Open orders finish */

/** History orders start */
/** Simple selectors */
export const getHistoryOrdersSelectorFilterCurr = (state: State): OrderItem[] => state.historyOrders;
export const getHistoryOrdersCountSelector = (state: State): number => state.countHistoryOrders;

/** Selector returns count of open orders */
export const getHistoryOrdersCount = createSelector(
  getOrdersState,
  getHistoryOrdersCountSelector,
);

/** Selector returns array of open orders filtered by currency*/
export const getHistoryOrdersFilterCurr = createSelector(
  getOrdersState,
  getHistoryOrdersSelectorFilterCurr,
);

/** History orders finish */

/** Orders currencies pairs start */

// export const getAllCurrencyPairsSelector = (state: State): OrderCurrencyPair[] => state.currencyPairs;
export const getAllCurrencyPairs = (state: State): OrderCurrencyPair[] => state.currencyPairs;

/** Selector returns array of open orders filtered by currency*/
export const getAllCurrencyPairsSelector = createSelector(
  getOrdersState,
  getAllCurrencyPairs
);

/** Orders currencies pairs finish */