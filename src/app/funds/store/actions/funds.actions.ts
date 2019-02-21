import {Action} from '@ngrx/store';

export const LOAD_CRYPTO_BAL = '[Funds] Load crypto balances';
export const FAIL_LOAD_CRYPTO_BAL = '[Funds] Fail load crypto balances';
export const SET_CRYPTO_BAL = '[Funds] Set crypto balances';
export const SET_MORE_CRYPTO_BAL = '[Funds] Concat crypto balances';

export const LOAD_FIAT_BAL = '[Funds] Load fiat balances';
export const FAIL_LOAD_FIAT_BAL = '[Funds] Fail load fiat balances';
export const SET_FIAT_BAL = '[Funds] Set fiat balances';
export const SET_MORE_FIAT_BAL = '[Funds] Concat fiat balances';

export const LOAD_PENDING_REQ = '[Funds] Load pending requests';
export const FAIL_LOAD_PENDING_REQ = '[Funds] Fail load pending requests';
export const SET_PENDING_REQ = '[Funds] Set pending requests';
export const SET_MORE_PENDING_REQ = '[Funds] Concat pending requests';

export const REVOKE_PENDING_REQ = '[Funds] Revoke pending requests';
export const REVOKE_PENDING_REQ_MOBILE = '[Funds] Revoke pending requests mobile';
export const FAIL_REVOKE_PENDING_REQ = '[Funds] Fail revoke pending requests';

export const LOAD_MY_BALANCES = '[Funds] Load my balances';
export const FAIL_LOAD_MY_BALANCES = '[Funds] Fail load my balances';
export const SET_MY_BALANCES = '[Funds] Set my balances';

export const LOAD_BALANCE_DETAILS_INFO = '[Funds] Load balance confirmation info';
export const FAIL_LOAD_BALANCE_DETAILS_INFO = '[Funds] Fail load balance confirmation info';
export const SET_BALANCE_DETAILS_INFO = '[Funds] Set balance confirmation info';

export const LOAD_MAX_CURRENCY_PAIR_BY_CURRENCY_NAME = '[Funds] Load max currency pair by currency name';
export const FAIL_LOAD_MAX_CURRENCY_PAIR_BY_CURRENCY_NAME = '[Funds] Fail Load currency pair by currency name';

export const LOAD_LAST_TRANSACTIONS_HISTORY = '[Funds] Load last transactions history';
export const LOAD_TRANSACTIONS_HISTORY = '[Funds] Load transactions history';
export const FAIL_LOAD_TRANSACTIONS_HISTORY = '[Funds] Fail load transactions history';
export const SET_TRANSACTIONS_HISTORY = '[Funds] Set transactions history';
export const SET_MORE_TRANSACTIONS_HISTORY = '[Funds] Concat transactions history';


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
export class SetMoreCryptoBalAction implements Action {
  readonly type = SET_MORE_CRYPTO_BAL;
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
export class SetMoreFiatBalAction implements Action {
  readonly type = SET_MORE_FIAT_BAL;
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
export class SetMorePendingReqAction implements Action {
  readonly type = SET_MORE_PENDING_REQ;
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
 * Get Balance Details info
 */
export class LoadBalanceDetailsAction implements Action {
  readonly type = LOAD_BALANCE_DETAILS_INFO;
  constructor(public payload?) {}
}
export class SetBalanceDetailsAction implements Action {
  readonly type = SET_BALANCE_DETAILS_INFO;
  constructor(public payload?) {}
}
export class FailLoadBalanceDetailsAction implements Action {
  readonly type = FAIL_LOAD_BALANCE_DETAILS_INFO;
  constructor(public payload?) {}
}
/**
 * Revoke pending request
 */
export class RevokePendingReqAction implements Action {
  readonly type = REVOKE_PENDING_REQ;
  constructor(public payload?) {}
}
export class RevokePendingReqMobileAction implements Action {
  readonly type = REVOKE_PENDING_REQ_MOBILE;
  constructor(public payload?) {}
}
export class FailRevokePendingReqAction implements Action {
  readonly type = FAIL_REVOKE_PENDING_REQ;
  constructor(public payload?) {}
}

export class LoadMaxCurrencyPairByCurrencyName implements Action {
  readonly type = LOAD_MAX_CURRENCY_PAIR_BY_CURRENCY_NAME;
  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload) {}
}

export class FailLoadMaxCurrencyPairByCurrencyName implements Action {
  readonly type = FAIL_LOAD_MAX_CURRENCY_PAIR_BY_CURRENCY_NAME;
  constructor(public payload) {}
}
/**
 * Loading crypto balances
 */
export class LoadTransactionsHistoryAction implements Action {
  readonly type = LOAD_TRANSACTIONS_HISTORY;
  constructor(public payload?) {}
}
export class LoadLastTransactionsHistoryAction implements Action {
  readonly type = LOAD_LAST_TRANSACTIONS_HISTORY;
  constructor(public payload?) {}
}
export class SetTransactionsHistoryAction implements Action {
  readonly type = SET_TRANSACTIONS_HISTORY;
  constructor(public payload?) {}
}
export class SetMoreTransactionsHistoryAction implements Action {
  readonly type = SET_MORE_TRANSACTIONS_HISTORY;
  constructor(public payload?) {}
}
export class FailLoadTransactionsHistoryAction implements Action {
  readonly type = FAIL_LOAD_TRANSACTIONS_HISTORY;
  constructor(public payload?) {}
}

/**
 * Exports possible action types
 */
export type Actions
  = LoadCryptoBalAction
  | SetCryptoBalAction
  | SetMoreCryptoBalAction
  | FailLoadCryptoBalAction
  | LoadFiatBalAction
  | SetFiatBalAction
  | SetMoreFiatBalAction
  | FailLoadFiatBalAction
  | LoadPendingReqAction
  | SetPendingReqAction
  | SetMorePendingReqAction
  | FailLoadPendingReqAction
  | LoadMyBalancesAction
  | SetMyBalancesAction
  | FailLoadMyBalancesAction
  | FailRevokePendingReqAction
  | RevokePendingReqAction
  | LoadBalanceDetailsAction
  | SetBalanceDetailsAction
  | FailLoadBalanceDetailsAction
  | LoadMaxCurrencyPairByCurrencyName
  | FailLoadMaxCurrencyPairByCurrencyName
  | LoadTransactionsHistoryAction
  | SetTransactionsHistoryAction
  | SetMoreTransactionsHistoryAction
  | FailLoadTransactionsHistoryAction

