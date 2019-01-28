import * as settingsActions from '../actions/settings.actions';
import {defaultValues} from './default-values';
import {createFeatureSelector, createSelector} from '@ngrx/store';

export interface State {
  loading: boolean;
  GAEnabled: boolean;
  GALoading: boolean;
  sessionTime: number;
}

export const INIT_STATE: State = {
  loading: false,
  GAEnabled: false,
  GALoading: false,
  sessionTime: 20,
};

/**
 * Exports reducing function
 * @param state
 * @param action
 */
export function reducer(state: State = INIT_STATE, action: settingsActions.Actions) {
  switch (action.type) {
    case settingsActions.LOAD_GA_STATUS:
      return {...state, GALoading: true};
    case settingsActions.SET_GA_STATUS:
      return {
        ...state,
        GALoading: false,
        GAEnabled: action.payload,
      };
    case settingsActions.FAIL_LOAD_GA_STATUS:
      return {
        ...state,
        GALoading: false,
      };

    default :
      return state;
  }
}

export const getGAStatusSelector = (state: State): boolean => state.GAEnabled;
export const getGALoadingSelector = (state: State): boolean => state.GALoading;
export const getSessionTimeSelector = (state: State): number => state.sessionTime;

