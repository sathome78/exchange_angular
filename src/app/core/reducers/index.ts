import { Params, RouterStateSnapshot } from '@angular/router';
import {ActionReducerMap, combineReducers, MetaReducer} from '@ngrx/store';
import {createSelector} from 'reselect';

// Imports from reducers
import * as fromDashboard from '../../dashboard/reducers/dashboard.reducer';
import * as fromFunds from '../../funds/store/reducers/funds.reducer';
import * as fromCore from './core.reducer';

/**
 * Top level state declaration
 */
export interface State {
  dashboard: fromDashboard.State;
  funds: fromFunds.State;
  core: fromCore.State;
}

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
}

// Map of the reducers
export const reducers: ActionReducerMap<State> = {
  dashboard: fromDashboard.reducer,
  funds: fromFunds.reducer,
  core: fromCore.reducer,
};

/**
 * Selectors returns smaller piece of state out of the root state
 */
export const getDashboardState = (state: State) => state.dashboard;
export const getFundsState = (state: State) => state.funds;
export const getCoreState = (state: State) => state.core;

/**
 * Selectors from dashboard module
 */
export const getCurrencyPair = createSelector(getDashboardState, fromDashboard.getCurrencyPair);
export const getCurrencyPairArray = createSelector(getDashboardState, fromDashboard.getCurrencyPairArray);
export const getUserBalance = createSelector(getDashboardState, fromDashboard.getUserBalance);
export const getSelectedOrderBookOrder = createSelector(getDashboardState, fromDashboard.getSelectedOrderBookOrder);
export const getCurrencyPairInfo = createSelector(getDashboardState, fromDashboard.getCurrencyPairInfo);
export const getLastSellBuyOrder = createSelector(getDashboardState, fromDashboard.getLastSellBuyOrder);
export const getAllTrades = createSelector(getDashboardState, fromDashboard.getAllTrades);
export const getLoadingAllTrades = createSelector(getDashboardState, fromDashboard.getLoadingAllTrades);
export const getTradingType = createSelector(getDashboardState, fromDashboard.getTradingType);

/**
 * Selectors from funds module
 */



/**
 * Selectors from Core module
 */

export const getSimpleCurrencyPairsSelector = createSelector(getCoreState, fromCore.getAllSimpleCurrencyPairs);
export const getAllCurrenciesForChoose = createSelector(getCoreState, fromCore.getAllCurrenciesForChoose);
export const getCryptoCurrenciesForChoose = createSelector(getCoreState, fromCore.getCryptoCurrenciesForChoose);
export const getFiatCurrenciesForChoose = createSelector(getCoreState, fromCore.getFiatCurrenciesForChoose);
