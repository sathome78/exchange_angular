import * as settingsActions from '../actions/settings.actions';
import {defaultValues} from './default-values';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {ApiKeyItem} from '../../../model/api-key.model';

export interface State {
  loading: boolean;
  GAEnabled: boolean;
  GALoading: boolean;
  apiKeyLoading: boolean;
  sessionTime: number;
  apiKeys: ApiKeyItem[];
}

export const INIT_STATE: State = {
  loading: false,
  GAEnabled: false,
  GALoading: false,
  apiKeyLoading: false,
  sessionTime: 20,
  apiKeys: []
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

    case settingsActions.LOAD_SESSION_TIME:
      return {...state, loading: true};
    case settingsActions.SET_SESSION_TIME:
      return {
        ...state,
        loading: false,
        sessionTime: +action.payload,
      };
    case settingsActions.FAIL_LOAD_SESSION_TIME:
      return {
        ...state,
        loading: false,
      };

    case settingsActions.LOAD_API_KEYS:
      return {...state, apiKeyLoading: true};
    case settingsActions.SET_API_KEYS:
      return {
        ...state,
        apiKeyLoading: false,
        apiKeys: action.payload.reverse(),
      }
    case settingsActions.FAIL_LOAD_API_KEYS:
      return {...state, apiKeyLoading: false}

    default :
      return state;
  }
}

export const getGAStatusSelector = (state: State): boolean => state.GAEnabled;
export const getGALoadingSelector = (state: State): boolean => state.GALoading;
export const getSessionTimeSelector = (state: State): number => state.sessionTime;
export const getApiKeysSelector = (state: State): ApiKeyItem[] => state.apiKeys;
export const getApiKeyLoadingSelector = (state: State): boolean => state.apiKeyLoading;

