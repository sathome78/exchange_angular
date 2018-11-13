import {Action} from '@ngrx/store';

export const SAVE_TO_STORE = '[Core] Saves data to app store';
export const SAVE_COMPLETE = '[Core] Saving user location data to cookie is complete';
export const SAVE_TOKEN = '[Core] Saves user\'s auth token';
export const REHYDRATE = '[Core] Rehydrate store';

/**
 * Change language | region | currency
 */
export class SaveToStoreAction implements Action {
  readonly type = SAVE_TO_STORE;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload: {currency?: string; region?: string, language?: string }) {}
}

/**
 * Save token to local storage
 */
export class SaveTokenAction implements Action {
  readonly type = SAVE_TOKEN;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload: string) {}
}

/**
 * Change success
 */
export class SaveCompleteAction implements Action {
  readonly type = SAVE_COMPLETE;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload) {}
}

/**
 * Rehydrate store
 */
export class RehydrateAction implements Action {
  readonly type = REHYDRATE;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload) {}
}


/**
 * Exports possible action types
 */
export type Actions = SaveToStoreAction | SaveTokenAction | SaveCompleteAction;
