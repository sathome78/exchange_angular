import {Action} from '@ngrx/store';
import {CurrencyPair} from 'app/model';
import {Order} from 'app/model/order.model';
import {SimpleCurrencyPair} from 'app/model/simple-currency-pair';

export const CHANGE_ACTIVE_CURRENCY_PAIR = '[Dashboard] Change currency pair';
export const SET_CURRENCY_PAIRS_FOR_MARKET = '[Dashboard] Set currency pairs for market';
export const SET_CURRENCY_PAIRS = '[Dashboard] Set currency pairs list';
export const SET_USER_FAVORITES_CURRENCY_PAIRS_FOR_MARKET = '[Dashboard] Set user favorites currency pairs for market';
export const TOGGLE_USER_FAVORITES_CURRENCY_PAIRS = '[Dashboard] Toggle user favorites currency pairs';
export const REFRESH_USER_BALANCE = '[Dashboard] Refresh user balance';
export const REFRESH_CURRENCY_PAIR_INFO = '[Dashboard] Refresh currency pair info';
export const SELECTED_ORDERBOOK_ORDER = '[Dashboard] Selected order-book order';
export const SET_LAST_SELL_BUY_ORDER = '[Dashboard] Set last sell buy order';
export const SET_ALL_TRADES = '[Dashboard] Set all trades';
export const SET_TRADING_TYPE = '[Dashboard] Set trading type';
export const SET_LAST_PRICE = '[Dashboard] Set last price';
export const SET_LAST_CREATED_ORDER = '[Dashboard] Set last created';

/**
 * Change currency pair 'BTC/USD'
 */
export class ChangeActiveCurrencyPairAction implements Action {
  readonly type = CHANGE_ACTIVE_CURRENCY_PAIR;
  constructor(public payload: SimpleCurrencyPair) {}
}

/**
 * Set last created order'
 */
export class SetLastCreatedOrderAction implements Action {
  readonly type = SET_LAST_CREATED_ORDER;
  constructor(public payload: Order) {}
}

/**
 * Load all currency pairs for market
 */
export class SetMarketsCurrencyPairsAction implements Action {
  readonly type = SET_CURRENCY_PAIRS_FOR_MARKET;
  constructor(public payload: CurrencyPair[]) {}
}
/**
 * Set all currency pairs
 */
export class SetCurrencyPairsAction implements Action {
  readonly type = SET_CURRENCY_PAIRS;
  constructor(public payload: CurrencyPair[]) {}
}
/**
 * Set user favorites currency pairs for market
 */
export class SetUserFavoritesCurrencyPairsAction implements Action {
  readonly type = SET_USER_FAVORITES_CURRENCY_PAIRS_FOR_MARKET;
  constructor(public payload: number[]) {}
}

/**
 * Toggle user favorites currency pairs
 */
export class ToggleUserFavoriteCurrencyPair implements Action {
  readonly type = TOGGLE_USER_FAVORITES_CURRENCY_PAIRS;
  constructor(public payload: number) {}
}

/**
 * Refresh user balance
 */
export class RefreshUserBalanceAction implements Action {
  readonly type = REFRESH_USER_BALANCE;
  constructor(public payload) {}
}

/**
 * Refresh user balance
 */
export class SetLastPriceAction implements Action {
  readonly type = SET_LAST_PRICE;
  constructor(public payload) {}
}

/**
 * Refresh currency pair info
 */
export class RefreshCurrencyPairInfoAction implements Action {
  readonly type = REFRESH_CURRENCY_PAIR_INFO;
  constructor(public payload) {}
}

/**
 * When selected order in order-book
 */
export class SelectedOrderBookOrderAction implements Action {
  readonly type = SELECTED_ORDERBOOK_ORDER;
  constructor(public payload) {}
}

/**
 * When set last sell or buy order in order-book
 */
export class SetLastSellBuyOrderAction implements Action {
  readonly type = SET_LAST_SELL_BUY_ORDER;
  constructor(public payload) {}
}

/**
 * When set last sell or buy order in order-book
 */
export class SetAllTradesAction implements Action {
  readonly type = SET_ALL_TRADES;
  constructor(public payload) {}
}

/**
 * When set last sell or buy order in order-book
 */
export class SetTradingTypeAction implements Action {
  readonly type = SET_TRADING_TYPE;
  constructor(public payload) {}
}

/**
 * Exports possible action types
 */
export type Actions
  = ChangeActiveCurrencyPairAction
  | SetMarketsCurrencyPairsAction
  | SetCurrencyPairsAction
  | SetUserFavoritesCurrencyPairsAction
  | ToggleUserFavoriteCurrencyPair
  | RefreshUserBalanceAction
  | RefreshCurrencyPairInfoAction
  | SelectedOrderBookOrderAction
  | SetLastSellBuyOrderAction
  | SetTradingTypeAction
  | SetLastCreatedOrderAction
  | SetLastPriceAction
  | SetAllTradesAction;
