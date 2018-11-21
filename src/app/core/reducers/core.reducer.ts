import * as core from '../actions/core.actions'
import {ActionReducer} from '@ngrx/store';
import {REHYDRATE, RehydrateAction} from '../actions/core.actions';

export interface State {
  currency: string;
  region: string;
  language: string;
}

export const INIT_STATE: State = {
  currency: null,
  region: null,
  language: null
};

/**
 * Exports reducing function
 * @param state
 * @param action
 */
export function reducer(state: State = INIT_STATE, action: core.Actions) {
  switch (action.type) {
    case core.SAVE_COMPLETE:
      return {...state, ...action.payload};

    case core.SAVE_TO_STORE:
      return {...state, ...action.payload};

    default :
      return state;
  }
}
/*

/!**
 * Meta reducer for rehydrating state
 * @param myReducer
 * @returns {(state:any, action:any)=>(any|any)}
 *!/
export function rehydrateState(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    if (action.type == REHYDRATE) {
      return {...(<RehydrateAction>action).payload, router : fromRouter.routerReducer};
    }
    return reducer(state, action);
  };
}
*/

/**
 * Selector returns current language
 */
export const getLanguage = (state: State): string => state.language;

/**
 * Selector returns current region
 */
export const getRegion = (state: State): string => state.region;
