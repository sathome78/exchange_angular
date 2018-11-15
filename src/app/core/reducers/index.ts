import { Params, RouterStateSnapshot } from '@angular/router';
import {ActionReducerMap, combineReducers, MetaReducer} from '@ngrx/store';
import {createSelector} from 'reselect';

// Imports from reducers
import * as fromDashboard from '../../dashboard/reducers/dashboard.reducer';

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

// Map of the reducers
export const reducers: ActionReducerMap<State> = {
  dashboard: fromDashboard.reducer,
};

/**
 * Selectors returns smaller piece of state out of the root state
 */
export const getDashboardState = (state: State) => state.dashboard;

/**
 * Selectors from dashboard module
 */
export const getCurrencyPair = createSelector(getDashboardState, fromDashboard.getCurrencyPair);
export const getCurrencyPairArray = createSelector(getDashboardState, fromDashboard.getCurrencyPairArray);
export const getUserBalance = createSelector(getDashboardState, fromDashboard.getUserBalance);
