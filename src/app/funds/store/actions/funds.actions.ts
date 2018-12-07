import {Action} from '@ngrx/store';

export const LOAD_CRYPTO_BAL = '[Funds] Load crypto balances';
export const FAIL_LOAD_CRYPTO_BAL = '[Funds] Fail load crypto balances';
export const SET_CRYPTO_BAL = '[Funds] Set crypto balances';

// export const LOAD_HISTORY_ORDERS = '[Funds] Load history orders';
// export const FAIL_LOAD_HISTORY_ORDERS = '[Funds] Fail load history orders';
// export const SET_HISTORY_ORDERS = '[Funds] Set history orders';

// export const LOAD_CURRENCY_PAIRS_ORDERS = '[Funds] Load currency pairs orders';
// export const FAIL_LOAD_CURRENCY_PAIRS_ORDERS = '[Funds] Fail load currency pairs orders';
// export const SET_CURRENCY_PAIRS_ORDERS = '[Funds] Set currency pairs orders';


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
 * Exports possible action types
 */
export type Actions
  = LoadCryptoBalAction
  | SetCryptoBalAction
  | FailLoadCryptoBalAction
  // | LoadHistoryOrdersAction
  // | SetHistoryOrdersAction
  // | FailLoadHistoryOrdersAction
  // | LoadCurrencyPairsAction
  // | SetCurrencyPairsAction
  // | FailLoadCurrencyPairsAction
