import {Action} from '@ngrx/store';

export const LOAD_GA_STATUS = '[Orders] Load GA status';
export const FAIL_LOAD_GA_STATUS = '[Orders] Fail load GA status';
export const SET_GA_STATUS = '[Orders] Set GA status';

/**
 * GA status actions
 */
export class LoadGAStatusAction implements Action {
  readonly type = LOAD_GA_STATUS;
  constructor(public payload: string) {}
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
 * Exports possible action types
 */
export type Actions
  = LoadGAStatusAction
  | SetGAStatusAction
  | FailLoadGAStatusAction
