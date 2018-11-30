import * as ordersActions from '../actions/orders.actions';
import {defaultValues} from './default-values';
import {OrderItem} from '../../order-item.model';
import {createFeatureSelector, createSelector} from '@ngrx/store';

export interface State {
  openOrders: OrderItem[];
  countOpenOrders: number;
  loading: boolean;
}

export const INIT_STATE: State = {
  openOrders: defaultValues.openOrders,
  countOpenOrders: defaultValues.countOpenOrders,
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
    case ordersActions.FAIL_LOAD_OPEN_ORDERS:
      return {
        ...state, 
        loading: false, 
      };

    default :
      return state;
  }
}

export const getOrdersState = createFeatureSelector<State>('orders');

/** Simple selectors */
export const getOpenOrdersSelector = (state: State): OrderItem[] => state.openOrders;
export const getOpenOrdersSelectorFilterCurr = 
  (state: State, props): OrderItem[] => 
    state.openOrders.filter((item) => item.currencyPairName.toUpperCase().indexOf(props.currency.toUpperCase()) >= 0);
export const getOpenOrdersCountSelector = (state: State): number => state.countOpenOrders;

/** Selector returns array of open orders*/
export const getOpenOrders = createSelector(
  getOrdersState,
  getOpenOrdersSelector,
);

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