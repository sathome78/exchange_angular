import {Action} from '@ngrx/store';
import {CHANGE_CURRENCY_PAIR} from '../../../dashboard/actions/dashboard.actions';

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
export const FAIL_REVOKE_PENDING_REQ = '[Funds] Fail revoke pending requests';

export const LOAD_MY_BALANCES = '[Funds] Load my balances';
export const FAIL_LOAD_MY_BALANCES = '[Funds] Fail load my balances';
export const SET_MY_BALANCES = '[Funds] Set my balances';

export const LOAD_BALANCE_DETAILS_INFO = '[Funds] Load balance confirmation info';
export const FAIL_LOAD_BALANCE_DETAILS_INFO = '[Funds] Fail load balance confirmation info';
export const SET_BALANCE_DETAILS_INFO = '[Funds] Set balance confirmation info';

export const LOAD_ALL_CURRENCIES_FOR_CHOOSE = '[Funds] Load all currencies for choose';
export const LOAD_CRYPTO_CURRENCIES_FOR_CHOOSE = '[Funds] Load crypto currencies for choose';
export const LOAD_FIAT_CURRENCIES_FOR_CHOOSE = '[Funds] Load fiat currencies for choose';

export const SET_ALL_CURRENCIES_FOR_CHOOSE = '[Funds] Set all currencies for choose';
export const SET_CRYPTO_CURRENCIES_FOR_CHOOSE = '[Funds] Set crypto currencies for choose';
export const SET_FIAT_CURRENCIES_FOR_CHOOSE = '[Funds] Set fiat currencies for choose';
export const LOAD_MAX_CURRENCY_PAIR_BY_CURRENCY_NAME = '[Funds] Load max currency pair by currency name';

export const FAIL_LOAD_CURRENCIES_FOR_CHOOSE = '[Funds] Fail Load currencies for choose';
export const FAIL_LOAD_MAX_CURRENCY_PAIR_BY_CURRENCY_NAME = '[Funds] Fail Load currency pair by currency name';

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
export class FailRevokePendingReqAction implements Action {
  readonly type = FAIL_REVOKE_PENDING_REQ;
  constructor(public payload?) {}
}
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

export class LoadAllCurrenciesForChoose implements Action {
  readonly type = LOAD_ALL_CURRENCIES_FOR_CHOOSE;
  /**
   * Default constructor
   * @param payload
   */
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

export class LoadCryptoCurrenciesForChoose implements Action {
  readonly type = LOAD_CRYPTO_CURRENCIES_FOR_CHOOSE;
  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload?) {}
}

export class LoadFiatCurrenciesForChoose implements Action {
  readonly type = LOAD_FIAT_CURRENCIES_FOR_CHOOSE;
  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload?) {}
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

export class FailLoadCurrenciesForChoose implements Action {
  readonly type = FAIL_LOAD_CURRENCIES_FOR_CHOOSE;
  constructor(public payload) {}
}

export class FailLoadMaxCurrencyPairByCurrencyName implements Action {
  readonly type = FAIL_LOAD_MAX_CURRENCY_PAIR_BY_CURRENCY_NAME;
  constructor(public payload) {}
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
  | SetAllCurrenciesForChoose
  | SetCryptoCurrenciesForChoose
  | SetFiatCurrenciesForChoose
  | FailRevokePendingReqAction
  | RevokePendingReqAction
  | LoadBalanceDetailsAction
  | SetBalanceDetailsAction
  | FailLoadBalanceDetailsAction
  | FailLoadCurrenciesForChoose
  | LoadAllCurrenciesForChoose
  | LoadCryptoCurrenciesForChoose
  | LoadFiatCurrenciesForChoose
  | LoadMaxCurrencyPairByCurrencyName
  | FailLoadMaxCurrencyPairByCurrencyName

