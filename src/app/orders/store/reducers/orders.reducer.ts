import * as ordersActions from '../actions/orders.actions';
import {defaultValues} from './default-values';
import {OrderItem} from '../../models/order-item.model';
import {createFeatureSelector, createSelector} from '@ngrx/store';

export interface State {
  openOrders: OrderItem[];
  countOpenOrders: number;
  loading: boolean;
  historyOrders: OrderItem[];
  countHistoryOrders: number;
}

export const INIT_STATE: State = {
  openOrders: defaultValues.openOrders,
  countOpenOrders: defaultValues.countOpenOrders,
  historyOrders: defaultValues.historyOrders,
  countHistoryOrders: defaultValues.countHistoryOrders,
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
    case ordersActions.LOAD_LAST_HISTORY_ORDERS:
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

    case ordersActions.CANCEL_OPEN_ORDER:
      return {...state, loading: true};
    case ordersActions.CROP_CANCELED_ORDER:
      return {
        ...state,
        openOrders: state.openOrders.filter((item) => item.id !== action.payload),
        loading: false,
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

// export const getAllCurrencyPairsSelector = (state: State): OrderCurrencyPair[] => state.currencyPairs;
export const getLoading = (state: State): boolean => state.loading;

/** Selector returns array of open orders filtered by currency*/
export const getLoadingSelector = createSelector(
  getOrdersState,
  getLoading
);
