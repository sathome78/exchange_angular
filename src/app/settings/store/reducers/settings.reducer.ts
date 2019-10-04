import * as settingsActions from '../actions/settings.actions';
import { ApiKeyItem } from '../../../model/api-key.model';

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
  apiKeys: [],
};

/**
 * Exports reducing function
 * @param state
 * @param action
 */
export function reducer(state: State = INIT_STATE, action: settingsActions.Actions) {
  switch (action.type) {
    case settingsActions.LOAD_SESSION_TIME:
      return { ...state, loading: true };
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
      return { ...state, apiKeyLoading: true };
    case settingsActions.SET_API_KEYS:
      return {
        ...state,
        apiKeyLoading: false,
        apiKeys: action.payload.reverse(),
      };
    case settingsActions.FAIL_LOAD_API_KEYS:
      return { ...state, apiKeyLoading: false };

    default:
      return state;
  }
}

export const getSessionTimeSelector = (state: State): number => state.sessionTime;
export const getApiKeysSelector = (state: State): ApiKeyItem[] => state.apiKeys;
export const getApiKeyLoadingSelector = (state: State): boolean => state.apiKeyLoading;
