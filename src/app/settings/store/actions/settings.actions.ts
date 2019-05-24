import { Action } from '@ngrx/store';

export const LOAD_GA_STATUS = '[Orders] Load GA status';
export const FAIL_LOAD_GA_STATUS = '[Orders] Fail load GA status';
export const SET_GA_STATUS = '[Orders] Set GA status';

export const LOAD_SESSION_TIME = '[Orders] Load session time';
export const FAIL_LOAD_SESSION_TIME = '[Orders] Fail load session time';
export const SET_SESSION_TIME = '[Orders] Set session time';

export const LOAD_API_KEYS = '[Orders] Load api keys';
export const FAIL_LOAD_API_KEYS = '[Orders] Fail load api keys';
export const SET_API_KEYS = '[Orders] Set api keys';

/**
 * GA status actions
 */
export class LoadGAStatusAction implements Action {
  readonly type = LOAD_GA_STATUS;
}
export class SetGAStatusAction implements Action {
  readonly type = SET_GA_STATUS;
  constructor(public payload: boolean) {}
}
export class FailLoadGAStatusAction implements Action {
  readonly type = FAIL_LOAD_GA_STATUS;
  constructor(public payload?) {}
}
/**
 * Session time actions
 */
export class LoadSessionTimeAction implements Action {
  readonly type = LOAD_SESSION_TIME;
  constructor(public payload?) {}
}
export class SetSessionTimeAction implements Action {
  readonly type = SET_SESSION_TIME;
  constructor(public payload: number) {}
}
export class FailLoadSessionTimeAction implements Action {
  readonly type = FAIL_LOAD_SESSION_TIME;
  constructor(public payload?) {}
}

/**
 * API Keys actions
 */
export class LoadApiKeysAction implements Action {
  readonly type = LOAD_API_KEYS;
}
export class SetApiKeysAction implements Action {
  readonly type = SET_API_KEYS;
  constructor(public payload: any[]) {}
}
export class FailLoadApiKeysAction implements Action {
  readonly type = FAIL_LOAD_API_KEYS;
  constructor(public payload?) {}
}

/**
 * Exports possible action types
 */
export type Actions
  = LoadGAStatusAction
  | SetGAStatusAction
  | FailLoadGAStatusAction
  | LoadSessionTimeAction
  | SetSessionTimeAction
  | FailLoadSessionTimeAction
  | LoadApiKeysAction
  | SetApiKeysAction
  | FailLoadApiKeysAction;
