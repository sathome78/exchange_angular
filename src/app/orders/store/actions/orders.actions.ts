import {Action} from '@ngrx/store';

export const LOAD_OPEN_ORDERS = '[Orders] Load open orders';
export const FAIL_LOAD_OPEN_ORDERS = '[Orders] Fail load open orders';
export const SET_OPEN_ORDERS = '[Orders] Set open orders';

export const LOAD_HISTORY_ORDERS = '[Orders] Load history orders';
export const FAIL_LOAD_HISTORY_ORDERS = '[Orders] Fail load history orders';
export const SET_HISTORY_ORDERS = '[Orders] Set history orders';

export const LOAD_CURRENCY_PAIRS_ORDERS = '[Orders] Load currency pairs orders';
export const FAIL_LOAD_CURRENCY_PAIRS_ORDERS = '[Orders] Fail load currency pairs orders';
export const SET_CURRENCY_PAIRS_ORDERS = '[Orders] Set currency pairs orders';


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
 * Load history orders
 */
export class LoadHistoryOrdersAction implements Action {
  readonly type = LOAD_HISTORY_ORDERS;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload?) {}
}

/**
 * Set history orders
 */
export class SetHistoryOrdersAction implements Action {
  readonly type = SET_HISTORY_ORDERS;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload?) {}
}
/**
 * Fail loading of history orders
 */
export class FailLoadHistoryOrdersAction implements Action {
  readonly type = FAIL_LOAD_HISTORY_ORDERS;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload?) {}
}


/**
 * Load currency pairs
 */
export class LoadCurrencyPairsAction implements Action {
  readonly type = LOAD_CURRENCY_PAIRS_ORDERS;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload?) {}
}

/**
 * Set currency pairs
 */
export class SetCurrencyPairsAction implements Action {
  readonly type = SET_CURRENCY_PAIRS_ORDERS;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload?) {}
}
/**
 * Fail loading of currency pairs
 */
export class FailLoadCurrencyPairsAction implements Action {
  readonly type = FAIL_LOAD_CURRENCY_PAIRS_ORDERS;

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
  | LoadHistoryOrdersAction
  | SetHistoryOrdersAction
  | FailLoadHistoryOrdersAction
  | LoadCurrencyPairsAction
  | SetCurrencyPairsAction
  | FailLoadCurrencyPairsAction
