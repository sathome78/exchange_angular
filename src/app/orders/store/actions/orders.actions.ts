import {Action} from '@ngrx/store';

export const LOAD_OPEN_ORDERS = '[Orders] Load open orders';
export const FAIL_LOAD_OPEN_ORDERS = '[Orders] Fail load open orders';
export const SET_OPEN_ORDERS = '[Orders] Set open orders';


/**
 * Load open orders
 */
export class LoadOpenOrdersAction implements Action {
  readonly type = LOAD_OPEN_ORDERS;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload?) {}
}

/**
 * Set open orders
 */
export class SetOpenOrdersAction implements Action {
  readonly type = SET_OPEN_ORDERS;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload?) {}
}
/**
 * Fail loading of open orders
 */
export class FailLoadOpenOrdersAction implements Action {
  readonly type = FAIL_LOAD_OPEN_ORDERS;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload?) {}
}



/**
 * Exports possible action types
 */
export type Actions
  = LoadOpenOrdersAction
  | SetOpenOrdersAction
  | FailLoadOpenOrdersAction
  // | RefreshCurrencyPairInfoAction
  // | SelectedOrderBookOrderAction
  // | SetLastSellBuyOrderAction
  // | SetAllTradesAction;
