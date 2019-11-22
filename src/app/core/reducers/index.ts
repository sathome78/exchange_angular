import { Params } from '@angular/router';
import { ActionReducerMap } from '@ngrx/store';
import { createSelector } from 'reselect';

// Imports from reducers
import * as fromDashboard from '../../dashboard/reducers/dashboard.reducer';
import * as fromFunds from '../../funds/store/reducers/funds.reducer';
import * as fromSettings from '../../settings/store/reducers/settings.reducer';
import * as fromCore from './core.reducer';

/**
 * Top level state declaration
 */
export interface State {
  dashboard: fromDashboard.State;
  funds: fromFunds.State;
  core: fromCore.State;
  settings: fromSettings.State;
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
  settings: fromSettings.reducer,
};

/**
 * Selectors returns smaller piece of state out of the root state
 */
export const getDashboardState = (state: State) => state.dashboard;
export const getFundsState = (state: State) => state.funds;
export const getCoreState = (state: State) => state.core;
export const getSettingsState = (state: State) => state.settings;

/**
 * Selectors from dashboard module
 */
export const getActiveCurrencyPair = createSelector(
  getDashboardState,
  fromDashboard.getActiveCurrencyPairSelector
);
export const getCurrencyPairArray = createSelector(
  getDashboardState,
  fromDashboard.getCurrencyPairArray
);
export const getMarketCurrencyPairsMap = createSelector(
  getDashboardState,
  fromDashboard.getMarketCurrencyPairsArraySelector
);
export const getFavoritesCurrencyPair = createSelector(
  getDashboardState,
  fromDashboard.getFavoritesCurrencyPairSelector
);
export const getUserBalance = createSelector(
  getDashboardState,
  fromDashboard.getUserBalance
);
export const getSelectedOrderBookOrder = createSelector(
  getDashboardState,
  fromDashboard.getSelectedOrderBookOrder
);
export const getCurrencyPairInfo = createSelector(
  getDashboardState,
  fromDashboard.getCurrencyPairInfo
);
export const getLastSellBuyOrder = createSelector(
  getDashboardState,
  fromDashboard.getLastSellBuyOrder
);
export const getAllTrades = createSelector(
  getDashboardState,
  fromDashboard.getAllTrades
);
export const getLastPrice = createSelector(
  getDashboardState,
  fromDashboard.getLastPrice
);
export const getLastCreatedOrder = createSelector(
  getDashboardState,
  fromDashboard.getLastCreatedOrder
);
export const getTradingType = createSelector(
  getDashboardState,
  fromDashboard.getTradingType
);
export const getOpenOrders = createSelector(
  getDashboardState,
  fromDashboard.getOpenOrders
);
export const getOpenOrdersCount = createSelector(
  getDashboardState,
  fromDashboard.getOpenOrdersCount
);
export const getHistoryOrders = createSelector(
  getDashboardState,
  fromDashboard.getHistoryOrders
);
export const getOrdersLoading = createSelector(
  getDashboardState,
  fromDashboard.getOrdersLoading
);
export const getOrdersBookBuyOrders = createSelector(
  getDashboardState,
  fromDashboard.getOrdersBookBuy
);
export const getOrdersBookSellOrders = createSelector(
  getDashboardState,
  fromDashboard.getOrdersBookSell
);

/**
 * Selectors from funds module
 */

/**
 * Selectors from Core module
 */

export const getLanguage = createSelector(
  getCoreState,
  fromCore.getLanguage
);
export const getVerificationStatus = createSelector(
  getCoreState,
  fromCore.getVerificationStatus
);
export const getSimpleCurrencyPairsSelector = createSelector(
  getCoreState,
  fromCore.getAllSimpleCurrencyPairs
);
export const getDetailedCurrencyPairsSelector = createSelector(
  getCoreState,
  fromCore.getAllDetailedCurrencyPairs
);
export const getAllCurrenciesForChoose = createSelector(
  getCoreState,
  fromCore.getAllCurrenciesForChoose
);
export const getCryptoCurrenciesForChoose = createSelector(
  getCoreState,
  fromCore.getCryptoCurrenciesForChoose
);
export const getFiatCurrenciesForChoose = createSelector(
  getCoreState,
  fromCore.getFiatCurrenciesForChoose
);
export const getIsAuthenticated = createSelector(
  getCoreState,
  fromCore.getIsAuthenticatedSelector
);
export const getUserInfo = createSelector(
  getCoreState,
  fromCore.getUserInfoSelector
);
export const getIEOList = createSelector(
  getCoreState,
  fromCore.getIEOListSelector
);
export const getIs2faEnabled = createSelector(
  getCoreState,
  fromCore.get2faEnabled
);
export const getIs2faStatusLoading = createSelector(
  getCoreState,
  fromCore.get2faStatusLoading
);

/**
 * Selectors from Settings module
 */
export const getSessionTime = createSelector(
  getSettingsState,
  fromSettings.getSessionTimeSelector
);
export const getSessionHistory = createSelector(
  getSettingsState,
  fromSettings.getSessionHistorySelector
);
export const getSessionHistoryLoading = createSelector(
  getSettingsState,
  fromSettings.getSessionHistoryLoadingSelector
);
export const getApiKeys = createSelector(
  getSettingsState,
  fromSettings.getApiKeysSelector
);
export const getApiKeyLoading = createSelector(
  getSettingsState,
  fromSettings.getApiKeyLoadingSelector
);
