import {Action} from '@ngrx/store';
import { TokenHolder } from 'app/model';

export const SAVE_TO_STORE = '[Core] Saves data to app store';
export const SAVE_COMPLETE = '[Core] Saving user location data to cookie is complete';
export const SAVE_TOKEN = '[Core] Saves user\'s auth token';
export const CHANGE_LANGUAGE = '[Core] Change language';
export const REHYDRATE = '[Core] Rehydrate store';

export const LOAD_VERIFICATION_STATUS = '[Core] Load verification status';
export const FAIL_LOAD_VERIFICATION_STATUS = '[Core] Fail load verification status';
export const SET_VERIFICATION_STATUS = '[Core] Set verification status';

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

export const ON_LOGIN = '[Core] On login';
export const ON_LOGOUT = '[Core] On logout';

/**
 * Change language | region | currency
 */
export class SaveToStoreAction implements Action {
  readonly type = SAVE_TO_STORE;
  constructor(public payload: {currency?: string; region?: string, language?: string }) {}
}

/**
 * Change language
 */
export class ChangeLanguageAction implements Action {
  readonly type = CHANGE_LANGUAGE;
  constructor(public payload: string) {}
}


export class LoadVerificationStatusAction implements Action {
  readonly type = LOAD_VERIFICATION_STATUS;
  constructor(public payload?) {}
}

export class SetVerificationStatusAction implements Action {
  readonly type = SET_VERIFICATION_STATUS;
  constructor(public payload: string) {}
}

export class FailLoadVerificationStatusAction implements Action {
  readonly type = FAIL_LOAD_VERIFICATION_STATUS;
  constructor(public payload?) {}
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

// Login/logout
export class SetOnLoginAction implements Action {
  readonly type = ON_LOGIN;
  constructor(public payload: ParsedToken) {}
}
export class SetOnLogoutAction implements Action {
  readonly type = ON_LOGOUT;
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
  | ChangeLanguageAction
  | SetVerificationStatusAction
  | LoadVerificationStatusAction
  | FailLoadVerificationStatusAction
  | SetOnLoginAction
  | SetOnLogoutAction
