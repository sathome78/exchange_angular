import { Action } from '@ngrx/store';
import { SessionHistoryItem } from 'app/model/session-history.model';

export const LOAD_SESSION_TIME = '[Orders] Load session time';
export const FAIL_LOAD_SESSION_TIME = '[Orders] Fail load session time';
export const SET_SESSION_TIME = '[Orders] Set session time';
export const LOAD_SESSION_HISTORY = '[Orders] Load session history';
export const FAIL_LOAD_SESSION_HISTORY = '[Orders] Fail load session history';
export const SET_SESSION_HISTORY = '[Orders] Set session history';

export const LOAD_API_KEYS = '[Orders] Load api keys';
export const FAIL_LOAD_API_KEYS = '[Orders] Fail load api keys';
export const SET_API_KEYS = '[Orders] Set api keys';

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
 * Session time actions
 */
export class LoadSessionHistoryAction implements Action {
  readonly type = LOAD_SESSION_HISTORY;
  constructor(public payload?) {}
}
export class SetSessionHistoryAction implements Action {
  readonly type = SET_SESSION_HISTORY;
  constructor(public payload: ResponseModel<SessionHistoryItem[]>) {}
}
export class FailLoadSessionHistoryAction implements Action {
  readonly type = FAIL_LOAD_SESSION_HISTORY;
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
export type Actions =
  | LoadSessionTimeAction
  | SetSessionTimeAction
  | FailLoadSessionTimeAction
  | LoadSessionHistoryAction
  | SetSessionHistoryAction
  | FailLoadSessionHistoryAction
  | LoadApiKeysAction
  | SetApiKeysAction
  | FailLoadApiKeysAction;
