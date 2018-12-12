import {Action} from '@ngrx/store';
import {CHANGE_CURRENCY_PAIR} from '../../../dashboard/actions/dashboard.actions';

export const LOAD_CRYPTO_BAL = '[Funds] Load crypto balances';
export const FAIL_LOAD_CRYPTO_BAL = '[Funds] Fail load crypto balances';
export const SET_CRYPTO_BAL = '[Funds] Set crypto balances';

// export const LOAD_HISTORY_ORDERS = '[Funds] Load history orders';
// export const FAIL_LOAD_HISTORY_ORDERS = '[Funds] Fail load history orders';
// export const SET_HISTORY_ORDERS = '[Funds] Set history orders';

// export const LOAD_CURRENCY_PAIRS_ORDERS = '[Funds] Load currency pairs orders';
// export const FAIL_LOAD_CURRENCY_PAIRS_ORDERS = '[Funds] Fail load currency pairs orders';
// export const SET_CURRENCY_PAIRS_ORDERS = '[Funds] Set currency pairs orders';

export const SET_ALL_CURRENCIES_FOR_CHOOSE = '[Funds] Set all currencies for choose';
export const SET_CRYPTO_CURRENCIES_FOR_CHOOSE = '[Funds] Set crypto currencies for choose';
export const SET_FIAT_CURRENCIES_FOR_CHOOSE = '[Funds] Set fiat currencies for choose';

/**
 * Loading crypto balances
 */
export class LoadCryptoBalAction implements Action {
  readonly type = LOAD_CRYPTO_BAL;
  constructor(public payload?) {}
}
export class SetCryptoBalAction implements Action {
  readonly type = SET_CRYPTO_BAL;
  constructor(public payload?) {}
}
export class FailLoadCryptoBalAction implements Action {
  readonly type = FAIL_LOAD_CRYPTO_BAL;
  constructor(public payload?) {}
}

// /**
//  * Load history orders
//  */
// export class LoadHistoryOrdersAction implements Action {
//   readonly type = LOAD_HISTORY_ORDERS;

//   /**
//    * Default constructor
//    * @param payload
//    */
//   constructor(public payload?) {}
// }

// /**
//  * Set history orders
//  */
// export class SetHistoryOrdersAction implements Action {
//   readonly type = SET_HISTORY_ORDERS;

//   /**
//    * Default constructor
//    * @param payload
//    */
//   constructor(public payload?) {}
// }
// /**
//  * Fail loading of history orders
//  */
// export class FailLoadHistoryOrdersAction implements Action {
//   readonly type = FAIL_LOAD_HISTORY_ORDERS;

//   /**
//    * Default constructor
//    * @param payload
//    */
//   constructor(public payload?) {}
// }


// /**
//  * Load currency pairs
//  */
// export class LoadCurrencyPairsAction implements Action {
//   readonly type = LOAD_CURRENCY_PAIRS_ORDERS;

//   /**
//    * Default constructor
//    * @param payload
//    */
//   constructor(public payload?) {}
// }

// /**
//  * Set currency pairs
//  */
// export class SetCurrencyPairsAction implements Action {
//   readonly type = SET_CURRENCY_PAIRS_ORDERS;

//   /**
//    * Default constructor
//    * @param payload
//    */
//   constructor(public payload?) {}
// }
// /**
//  * Fail loading of currency pairs
//  */
// export class FailLoadCurrencyPairsAction implements Action {
//   readonly type = FAIL_LOAD_CURRENCY_PAIRS_ORDERS;

//   /**
//    * Default constructor
//    * @param payload
//    */
//   constructor(public payload?) {}
// }

/**
 * Change currency pair 'BTC/USD'
 */
export class SetAllCurrenciesForChoose implements Action {
  readonly type = SET_ALL_CURRENCIES_FOR_CHOOSE;
  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload) {}
}

export class SetCryptoCurrenciesForChoose implements Action {
  readonly type = SET_CRYPTO_CURRENCIES_FOR_CHOOSE;
  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload) {}
}

export class SetFiatCurrenciesForChoose implements Action {
  readonly type = SET_FIAT_CURRENCIES_FOR_CHOOSE;
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
  = LoadCryptoBalAction
  | SetCryptoBalAction
  | FailLoadCryptoBalAction
  | SetAllCurrenciesForChoose
  | SetCryptoCurrenciesForChoose
  | SetFiatCurrenciesForChoose
  // | LoadHistoryOrdersAction
  // | SetHistoryOrdersAction
  // | FailLoadHistoryOrdersAction
  // | LoadCurrencyPairsAction
  // | SetCurrencyPairsAction
  // | FailLoadCurrencyPairsAction
