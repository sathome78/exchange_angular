import { createSelector } from 'reselect';
import { routerReducer } from '@ngrx/router-store';
// Imports from reducers
import * as fromAuth from '../../auth/reducers/auth.reducer';
import * as fromCatalog from '../../catalog/reducers/catalog.reducer';
import * as fromCart from '../../cart/reducers/cart.reducer';
import * as fromTesting from '../../testing/reducers/testing.reducer';
import * as fromAssessments from '../../assessments/reducers/assessments.reducer';
import * as fromProfile from '../../profile/reducers/profile.reducer';
import * as fromCore from './core.reducer';
import * as fromDashboard from '../../dashboard/reducers/dashboard.reducer';
import { rehydrateState } from './core.reducer';
var CustomSerializer = /** @class */ (function () {
    function CustomSerializer() {
    }
    CustomSerializer.prototype.serialize = function (routerState) {
        var url = routerState.url;
        var queryParams = routerState.root.queryParams;
        // Only return an object including the URL and query params
        // instead of the entire snapshot
        return { url: url, queryParams: queryParams };
    };
    return CustomSerializer;
}());
export { CustomSerializer };
// Map of the reducers
export var reducers = {
    auth: fromAuth.reducer,
    catalog: fromCatalog.reducer,
    cart: fromCart.reducer,
    testing: fromTesting.reducer,
    assessments: fromAssessments.reducer,
    profile: fromProfile.reducer,
    core: fromCore.reducer,
    dashboard: fromDashboard.reducer,
    router: routerReducer,
};
export var metaReducers = [rehydrateState];
// const developmentReducer: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);
// const productionReducer: ActionReducer<State> = combineReducers(reducers);
/**
 * Creates and exports root reducer
 * @type {ActionReducer<any>}
 */
// export function reducer(state: State, action: Action) {
//   return environment.production ? productionReducer(state, action) : developmentReducer(state, action);
// }
/**
 * Selectors returns smaller piece of state out of the root state
 */
export var getAuthState = function (state) { return state.auth; };
export var getCatalogState = function (state) { return state.catalog; };
export var getCartState = function (state) { return state.cart; };
export var getTestingState = function (state) { return state.testing; };
export var getAssessmentsState = function (state) { return state.assessments; };
export var getProfileState = function (state) { return state.profile; };
export var getCoreState = function (state) { return state.core; };
export var getDashboardState = function (state) { return state.dashboard; };
/**
 * Selectors from authorization module reducer
 */
export var isAuthReady = createSelector(getAuthState, fromAuth.isAuthReady);
export var isLoggedIn = createSelector(getAuthState, fromAuth.isLoggedIn);
export var isLoggingIn = createSelector(getAuthState, fromAuth.isLoggingIn);
export var getLoggedUser = createSelector(getAuthState, fromAuth.getLoggedUser);
export var getAuthError = createSelector(getAuthState, fromAuth.getAuthError);
export var getRecoveryError = createSelector(getAuthState, fromAuth.getRecoveryError);
export var isProfileVerified = createSelector(getAuthState, fromAuth.isProfileVerified);
export var isMailSent = createSelector(getAuthState, fromAuth.isMailSent);
export var isUpdateSuccess = createSelector(getAuthState, fromAuth.isUpdateSuccess);
export var status = createSelector(getAuthState, fromAuth.status);
export var isProfileLoading = createSelector(getAuthState, fromAuth.isLoading);
/**
 * Selectors from catalog module reducer
 */
export var getAllProducts = createSelector(getCatalogState, fromCatalog.getAllProducts);
export var getCategories = createSelector(getCatalogState, fromCatalog.getCategories);
export var getProductDetails = createSelector(getCatalogState, fromCatalog.getProductDetails);
export var getParams = createSelector(getCatalogState, fromCatalog.getParams);
export var isLastPage = createSelector(getCatalogState, fromCatalog.isLastPage);
export var isProductsLoading = createSelector(getCatalogState, fromCatalog.isLoading);
/**
 * Selectors from cart module reducer
 */
export var getCartItems = createSelector(getCartState, fromCart.getCartItems);
export var getPaymentDetails = createSelector(getCartState, fromCart.getPaymentDetails);
export var isTransactionSuccess = createSelector(getCartState, fromCart.isTransactionSuccess);
export var isBusy = createSelector(getCartState, fromCart.isBusy);
export var getReferralCodes = createSelector(getCartState, fromCart.getReferralCodes);
export var getReferralError = createSelector(getCartState, fromCart.getReferralError);
export var isFree = createSelector(getCartState, fromCart.isFree);
/**
 * Selectors for take assessment page
 */
export var getCurrentQuestion = createSelector(getTestingState, fromTesting.getCurrentQuestion);
export var getCurrentIndex = createSelector(getTestingState, fromTesting.getCurrentIndex);
export var getQuestionList = createSelector(getTestingState, fromTesting.getQuestionList);
/**
 * Selectors from assessments module reducer
 */
export var getAllAssessments = createSelector(getAssessmentsState, fromAssessments.getAllAssessments);
export var getQueryParams = createSelector(getAssessmentsState, fromAssessments.getQueryParams);
export var getAssessmentCategories = createSelector(getAssessmentsState, fromAssessments.getAssessmentCategories);
export var isLast = createSelector(getAssessmentsState, fromAssessments.isLast);
export var isAssessmentsLoading = createSelector(getAssessmentsState, fromAssessments.isLoading);
export var getTestingSession = createSelector(getTestingState, fromTesting.getTestingSession);
export var getTestingSessionUuid = createSelector(getTestingState, fromTesting.getTestingSessionUuid);
export var getTestingAssessmentUuid = createSelector(getTestingState, fromTesting.getTestingAssessmentUuid);
export var getAnsweredCount = createSelector(getTestingState, fromTesting.getAnsweredCount);
export var getAnsweredAndSkippedCount = createSelector(getTestingState, fromTesting.getAnsweredAndSkippedCount);
export var getQuestionStartTime = createSelector(getTestingState, fromTesting.getQuestionStartTime);
/**
 * Selectors from profile module
 */
export var getProfileError = createSelector(getProfileState, fromProfile.getProfileError);
export var getReferrerInfo = createSelector(getProfileState, fromProfile.getReferrerInfo);
export var isChangeSuccess = createSelector(getProfileState, fromProfile.isChangeSuccess);
/**
 * Selectors from core module
 */
export var getLanguage = createSelector(getCoreState, fromCore.getLanguage);
export var getRegion = createSelector(getCoreState, fromCore.getRegion);
/**
 * Selectors from dashboard module
 */
export var getYscoreResults = createSelector(getDashboardState, fromDashboard.getYscoreResults);
export var getYscoreDetails = createSelector(getDashboardState, fromDashboard.getYscoreDetails);
export var getDashboardParams = createSelector(getDashboardState, fromDashboard.getDashboardParams);
export var isLastYscorePage = createSelector(getDashboardState, fromDashboard.isLastYscorePage);
