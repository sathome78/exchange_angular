import {Action} from '@ngrx/store';

export const CHANGE_CURRENCY_PAIR = '[Dashboard] Change currency pair';
export const LOAD_CURRENCY_PAIRS = '[Dashboard] Load currency pair';
export const REFRESH_USER_BALANCE = '[Dashboard] Refresh user balance';
export const REFRESH_CURRENCY_PAIR_INFO = '[Dashboard] Refresh currency pair info';
export const LOAD_CURRENCY_PAIR_INFO = '[Dashboard] Load currency pair info';
export const FAIL_LOAD_CURRENCY_PAIR_INFO = '[Dashboard] Fail load currency pair info';
export const SELECTED_ORDERBOOK_ORDER = '[Dashboard] Selected order-book order';
export const SET_LAST_SELL_BUY_ORDER = '[Dashboard] Set last sell buy order';
export const SET_ALL_TRADES = '[Dashboard] Set all trades';
export const SET_TRADING_TYPE = '[Dashboard] Set trading type';
export const SET_LAST_PRICE = '[Dashboard] Set last price';

/**
 * Change currency pair 'BTC/USD'
 */
export class ChangeCurrencyPairAction implements Action {
  readonly type = CHANGE_CURRENCY_PAIR;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload) {}
}

/**
 * Load all currency pairs for market
 */
export class LoadCurrencyPairsAction implements Action {
  readonly type = LOAD_CURRENCY_PAIRS;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload) {}
}

/**
 * Refresh user balance
 */
export class RefreshUserBalanceAction implements Action {
  readonly type = REFRESH_USER_BALANCE;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload) {}
}

/**
 * Refresh user balance
 */
export class SetLastPriceAction implements Action {
  readonly type = SET_LAST_PRICE;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload) {}
}

/**
 * Refresh currency pair info
 */
export class RefreshCurrencyPairInfoAction implements Action {
  readonly type = REFRESH_CURRENCY_PAIR_INFO;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload) {}
}
/**
 * Load currency pair info
 */
export class LoadCurrencyPairInfoAction implements Action {
  readonly type = LOAD_CURRENCY_PAIR_INFO;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload) {}
}
/**
 * Fail load currency pair info
 */
export class FailLoadCurrencyPairInfoAction implements Action {
  readonly type = FAIL_LOAD_CURRENCY_PAIR_INFO;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload) {}
}

/**
 * When selected order in order-book
 */
export class SelectedOrderBookOrderAction implements Action {
  readonly type = SELECTED_ORDERBOOK_ORDER;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload) {}
}

/**
 * When set last sell or buy order in order-book
 */
export class SetLastSellBuyOrderAction implements Action {
  readonly type = SET_LAST_SELL_BUY_ORDER;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload) {}
}

/**
 * When set last sell or buy order in order-book
 */
export class SetAllTradesAction implements Action {
  readonly type = SET_ALL_TRADES;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload) {}
}

/**
 * When set last sell or buy order in order-book
 */
export class SetTradingTypeAction implements Action {
  readonly type = SET_TRADING_TYPE;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload) {}
}

/**
 * Exports possible action types
 */
export type Actions
  = ChangeCurrencyPairAction
  | LoadCurrencyPairsAction
  | RefreshUserBalanceAction
  | RefreshCurrencyPairInfoAction
  | LoadCurrencyPairInfoAction
  | FailLoadCurrencyPairInfoAction
  | SelectedOrderBookOrderAction
  | SetLastSellBuyOrderAction
  | SetTradingTypeAction
  | SetLastPriceAction
  | SetAllTradesAction;
