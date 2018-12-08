import {Action} from '@ngrx/store';

export const LOAD_CRYPTO_BAL = '[Funds] Load crypto balances';
export const FAIL_LOAD_CRYPTO_BAL = '[Funds] Fail load crypto balances';
export const SET_CRYPTO_BAL = '[Funds] Set crypto balances';

export const LOAD_FIAT_BAL = '[Funds] Load fiat balances';
export const FAIL_LOAD_FIAT_BAL = '[Funds] Fail load fiat balances';
export const SET_FIAT_BAL = '[Funds] Set fiat balances';




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
/**
 * Loading fiat balances
 */
export class LoadFiatBalAction implements Action {
  readonly type = LOAD_FIAT_BAL;
  constructor(public payload?) {}
}
export class SetFiatBalAction implements Action {
  readonly type = SET_FIAT_BAL;
  constructor(public payload?) {}
}
export class FailLoadFiatBalAction implements Action {
  readonly type = FAIL_LOAD_FIAT_BAL;
  constructor(public payload?) {}
}


/**
 * Exports possible action types
 */
export type Actions
  = LoadCryptoBalAction
  | SetCryptoBalAction
  | FailLoadCryptoBalAction
  | LoadFiatBalAction
  | SetFiatBalAction
  | FailLoadFiatBalAction
  // | LoadCurrencyPairsAction
  // | SetCurrencyPairsAction
  // | FailLoadCurrencyPairsAction
