import {Action} from '@ngrx/store';
import {NavigationExtras} from '@angular/router';

export const GO = '[Router] Go';
export const BACK = '[Router] Back';
export const FORWARD = '[Router] Forward';
export const SEARCH = '[Router] Search';

export class GoAction implements Action {
  readonly type = GO;

  constructor(public payload: {
    path: any[];
    query?: object;
    extras?: NavigationExtras;
  }) {

  }
}

/**
 * Navigates back
 */
export class BackAction implements Action {
  readonly type = BACK;
}

/**
 * Navigates forward
 */
export class ForwardAction implements Action {
  readonly type = FORWARD;
}

/**
 * Navigate with changing quesry params
 */
export class SearchAction implements Action {
  readonly type = SEARCH;

  constructor(public payload: { [key: string]: string; }) {
  };
}

/**
 * Temporary function for faster migration to v4 of th ngrx. Creates Go action
 */
export const go = (path: string, query?: object) => new GoAction({path: [path], query});

/**
 * Temporary function for faster migration to v4 of th ngrx. Creates Back action
 */
export const back = () => new BackAction();

/**
 * Temporary function for faster migration to v4 of th ngrx. Creates Search
 */
export const search = (query: { [key: string]: string; }) => new SearchAction(query);

export type Actions
  = GoAction
  | BackAction
  | ForwardAction
  | SearchAction;
