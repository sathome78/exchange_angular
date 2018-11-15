import {Action} from '@ngrx/store';

export const CHANGE_CURRENCY_PAIR = '[Dashboard] Change currency pair';
export const LOAD_CURRENCY_PAIRS = '[Dashboard] Load currency pair';
export const REFRASH_USER_BALANCE = '[Dashboard] Load currency pair';

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

export class LoadCurrencyPairsAction implements Action {
  readonly type = LOAD_CURRENCY_PAIRS;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload) {}
}

export class RefreshUserBalanceAction implements Action {
  readonly type = REFRASH_USER_BALANCE;

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
  | RefreshUserBalanceAction;
