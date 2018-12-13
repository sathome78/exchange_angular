import {Action} from '@ngrx/store';

export const LOAD_CRYPTO_BAL = '[Funds] Load crypto balances';
export const FAIL_LOAD_CRYPTO_BAL = '[Funds] Fail load crypto balances';
export const SET_CRYPTO_BAL = '[Funds] Set crypto balances';

export const LOAD_FIAT_BAL = '[Funds] Load fiat balances';
export const FAIL_LOAD_FIAT_BAL = '[Funds] Fail load fiat balances';
export const SET_FIAT_BAL = '[Funds] Set fiat balances';

export const LOAD_PENDING_REQ = '[Funds] Load pending requests';
export const FAIL_LOAD_PENDING_REQ = '[Funds] Fail load pending requests';
export const SET_PENDING_REQ = '[Funds] Set pending requests';

export const LOAD_MY_BALANCES = '[Funds] Load my balances';
export const FAIL_LOAD_MY_BALANCES = '[Funds] Fail load my balances';
export const SET_MY_BALANCES = '[Funds] Set my balances';


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
 * Loading fiat balances
 */
export class LoadPendingReqAction implements Action {
  readonly type = LOAD_PENDING_REQ;
  constructor(public payload?) {}
}
export class SetPendingReqAction implements Action {
  readonly type = SET_PENDING_REQ;
  constructor(public payload?) {}
}
export class FailLoadPendingReqAction implements Action {
  readonly type = FAIL_LOAD_PENDING_REQ;
  constructor(public payload?) {}
}

/**
 * Loading my balances
 */
export class LoadMyBalancesAction implements Action {
  readonly type = LOAD_MY_BALANCES;
  constructor(public payload?) {}
}
export class SetMyBalancesAction implements Action {
  readonly type = SET_MY_BALANCES;
  constructor(public payload?) {}
}
export class FailLoadMyBalancesAction implements Action {
  readonly type = FAIL_LOAD_MY_BALANCES;
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
  | LoadPendingReqAction
  | SetPendingReqAction
  | FailLoadPendingReqAction
  | LoadMyBalancesAction
  | SetMyBalancesAction
  | FailLoadMyBalancesAction