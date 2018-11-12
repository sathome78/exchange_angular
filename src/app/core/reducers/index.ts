import { Params, RouterStateSnapshot } from '@angular/router';
import {Action, ActionReducer, ActionReducerMap, combineReducers, MetaReducer} from '@ngrx/store';
import {storeFreeze} from 'ngrx-store-freeze';
import {createSelector} from 'reselect';
import {compose} from '@ngrx/store';
import {environment} from '../../../environments/environment';

import {
  StoreRouterConnectingModule,
  routerReducer,
  RouterReducerState,
  RouterStateSerializer
} from '@ngrx/router-store';

// Imports from reducers
import * as fromDashboard from '../../dashboard/reducers/dashboard.reducer';

import {rehydrateState} from './core.reducer';

/**
 * Top level state declaration
 */
export interface State {
  dashboard: fromDashboard.State;
}

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const queryParams = routerState.root.queryParams;

    // Only return an object including the URL and query params
    // instead of the entire snapshot
    return { url, queryParams };
  }
}

// Map of the reducers
export const reducers: ActionReducerMap<State> = {
  dashboard: fromDashboard.reducer,
};

export const metaReducers: MetaReducer<any, any>[] = [rehydrateState];

/**
 * Selectors returns smaller piece of state out of the root state
 */
export const getDashboardState = (state: State) => state.dashboard;

/**
 * Selectors from dashboard module
 */
export const getCurrencyPair = createSelector(getDashboardState, fromDashboard.getCurrencyPair);
