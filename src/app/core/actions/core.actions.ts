import {Action} from '@ngrx/store';

export const SAVE_TO_STORE = '[Core] Saves data to app store';
export const SAVE_COMPLETE = '[Core] Saving user location data to cookie is complete';
export const SAVE_TOKEN = '[Core] Saves user\'s auth token';
export const REHYDRATE = '[Core] Rehydrate store';


export const LOAD_SIMPLE_CURRENCY_PAIRS = '[Orders] Load simple currency pairs';
export const FAIL_LOAD_SIMPLE_CURRENCY_PAIRS = '[Orders] Fail load simple currency pairs';
export const SET_SIMPLE_CURRENCY_PAIRS = '[Orders] Set simple currency pairs';

export const LOAD_ALL_CURRENCIES_FOR_CHOOSE = '[Funds] Load all currencies for choose';
export const LOAD_CRYPTO_CURRENCIES_FOR_CHOOSE = '[Funds] Load crypto currencies for choose';
export const LOAD_FIAT_CURRENCIES_FOR_CHOOSE = '[Funds] Load fiat currencies for choose';

export const SET_ALL_CURRENCIES_FOR_CHOOSE = '[Funds] Set all currencies for choose';
export const SET_CRYPTO_CURRENCIES_FOR_CHOOSE = '[Funds] Set crypto currencies for choose';
export const SET_FIAT_CURRENCIES_FOR_CHOOSE = '[Funds] Set fiat currencies for choose';

export const FAIL_LOAD_CURRENCIES_FOR_CHOOSE = '[Funds] Fail Load currencies for choose';

/**
 * Change language | region | currency
 */
export class SaveToStoreAction implements Action {
  readonly type = SAVE_TO_STORE;
  constructor(public payload: {currency?: string; region?: string, language?: string }) {}
}

/**
 * Save token to local storage
 */
export class SaveTokenAction implements Action {
  readonly type = SAVE_TOKEN;
  constructor(public payload: string) {}
}

/**
 * Change success
 */
export class SaveCompleteAction implements Action {
  readonly type = SAVE_COMPLETE;
  constructor(public payload) {}
}

/**
 * Rehydrate store
 */
export class RehydrateAction implements Action {
  readonly type = REHYDRATE;
  constructor(public payload) {}
}


/**
 * Load currency pairs
 */
export class LoadCurrencyPairsAction implements Action {
  readonly type = LOAD_SIMPLE_CURRENCY_PAIRS;
  constructor(public payload?) {}
}

/**
 * Set currency pairs
 */
export class SetCurrencyPairsAction implements Action {
  readonly type = SET_SIMPLE_CURRENCY_PAIRS;

  constructor(public payload?) {}
}
/**
 * Fail loading of currency pairs
 */
export class FailLoadCurrencyPairsAction implements Action {
  readonly type = FAIL_LOAD_SIMPLE_CURRENCY_PAIRS;

  constructor(public payload?) {}
}

export class LoadAllCurrenciesForChoose implements Action {
  readonly type = LOAD_ALL_CURRENCIES_FOR_CHOOSE;
  constructor(public payload?) {}
}
export class LoadCryptoCurrenciesForChoose implements Action {
  readonly type = LOAD_CRYPTO_CURRENCIES_FOR_CHOOSE;
  constructor(public payload?) {}
}

export class LoadFiatCurrenciesForChoose implements Action {
  readonly type = LOAD_FIAT_CURRENCIES_FOR_CHOOSE;
  constructor(public payload?) {}
}


  /**
  * Change currency pair 'BTC/USD'
  */
 export class SetAllCurrenciesForChoose implements Action {
  readonly type = SET_ALL_CURRENCIES_FOR_CHOOSE;
  constructor(public payload) {}
}
export class SetCryptoCurrenciesForChoose implements Action {
  readonly type = SET_CRYPTO_CURRENCIES_FOR_CHOOSE;
  constructor(public payload) {}
}

export class SetFiatCurrenciesForChoose implements Action {
  readonly type = SET_FIAT_CURRENCIES_FOR_CHOOSE;
  constructor(public payload) {}
}

export class FailLoadCurrenciesForChoose implements Action {
  readonly type = FAIL_LOAD_CURRENCIES_FOR_CHOOSE;
  constructor(public payload) {}
}




/**
 * Exports possible action types
 */
export type Actions
  = SaveToStoreAction
  | SaveTokenAction
  | SaveCompleteAction
  | LoadCurrencyPairsAction
  | SetCurrencyPairsAction
  | FailLoadCurrencyPairsAction
  | LoadAllCurrenciesForChoose
  | LoadCryptoCurrenciesForChoose
  | LoadFiatCurrenciesForChoose
  | SetAllCurrenciesForChoose
  | SetCryptoCurrenciesForChoose
  | SetFiatCurrenciesForChoose
  | FailLoadCurrenciesForChoose
