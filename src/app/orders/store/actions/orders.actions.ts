import { Action } from '@ngrx/store';

export const LOAD_OPEN_ORDERS = '[Orders] Load open orders';
export const FAIL_LOAD_OPEN_ORDERS = '[Orders] Fail load open orders';
export const SET_OPEN_ORDERS = '[Orders] Set open orders';
export const SET_MORE_OPEN_ORDERS = '[Orders] Set more open orders';

export const LOAD_HISTORY_ORDERS = '[Orders] Load history orders';
export const LOAD_LAST_HISTORY_ORDERS = '[Orders] Load last history orders';
export const FAIL_LOAD_HISTORY_ORDERS = '[Orders] Fail load history orders';
export const SET_HISTORY_ORDERS = '[Orders] Set history orders';
export const SET_MORE_HISTORY_ORDERS = '[Orders] Set more history orders';

export const CANCEL_OPEN_ORDER = '[Orders] Cancel open order';
export const CROP_CANCELED_ORDER = '[Orders] Crop canceled order for mobile screens';
export const FAIL_ORDERS = '[Orders] Fail of loading in orders';

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
 * Set more open orders
 */
export class SetMoreOpenOrdersAction implements Action {
  readonly type = SET_MORE_OPEN_ORDERS;

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
 * Load last history orders
 */
export class LoadLastHistoryOrdersAction implements Action {
  readonly type = LOAD_LAST_HISTORY_ORDERS;

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
 * Set more history orders
 */
export class SetMoreHistoryOrdersAction implements Action {
  readonly type = SET_MORE_HISTORY_ORDERS;

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

export class FailAction implements Action {
  readonly type = FAIL_ORDERS;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload?) {}
}
export class CancelOrderAction implements Action {
  readonly type = CANCEL_OPEN_ORDER;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload?) {}
}

export class CropCanceledOrderAction implements Action {
  readonly type = CROP_CANCELED_ORDER;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload?) {}
}

/**
 * Exports possible action types
 */
export type Actions =
  | LoadOpenOrdersAction
  | SetOpenOrdersAction
  | SetMoreOpenOrdersAction
  | FailLoadOpenOrdersAction
  | LoadHistoryOrdersAction
  | LoadLastHistoryOrdersAction
  | SetHistoryOrdersAction
  | SetMoreHistoryOrdersAction
  | FailLoadHistoryOrdersAction
  | CancelOrderAction
  | FailAction
  | CropCanceledOrderAction;
