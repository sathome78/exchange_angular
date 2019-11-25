import * as settingsActions from '../actions/settings.actions';
import { ApiKeyItem } from '../../../model/api-key.model';
import { SessionHistoryItem } from 'app/model/session-history.model';

export interface State {
  loading: boolean;
  GAEnabled: boolean;
  GALoading: boolean;
  apiKeyLoading: boolean;
  sessionTime: number;
  apiKeys: ApiKeyItem[];
  sessionHistoryItems: SessionHistoryItem[];
  sessionHistoryCount: number;
  sessionHistoryLoading: boolean;
}

export const INIT_STATE: State = {
  loading: false,
  GAEnabled: false,
  GALoading: false,
  apiKeyLoading: false,
  sessionTime: 20,
  sessionHistoryItems: [],
  sessionHistoryCount: 0,
  sessionHistoryLoading: false,
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

    case settingsActions.LOAD_SESSION_HISTORY:
      return { ...state, sessionHistoryLoading: true };
    case settingsActions.SET_SESSION_HISTORY:
      return {
        ...state,
        sessionHistoryLoading: false,
        sessionHistoryItems: action.payload.items,
        sessionHistoryCount: action.payload.count,
      };
    case settingsActions.FAIL_LOAD_SESSION_HISTORY:
      return {
        ...state,
        sessionHistoryLoading: false,
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
export const getSessionHistorySelector = (state: State): ResponseModel<SessionHistoryItem[]> =>
  ({ count: state.sessionHistoryCount, items: state.sessionHistoryItems });
export const getSessionHistoryLoadingSelector = (state: State): boolean => state.sessionHistoryLoading;
export const getApiKeysSelector = (state: State): ApiKeyItem[] => state.apiKeys;
export const getApiKeyLoadingSelector = (state: State): boolean => state.apiKeyLoading;
