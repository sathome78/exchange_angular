var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as core from '../actions/core.actions';
import { REHYDRATE } from '../actions/core.actions';
import * as fromRouter from '@ngrx/router-store';
export var INIT_STATE = {
    currency: null,
    region: null,
    language: null
};
/**
 * Exports reducing function
 * @param state
 * @param action
 */
export function reducer(state, action) {
    if (state === void 0) { state = INIT_STATE; }
    switch (action.type) {
        case core.SAVE_COMPLETE:
            return __assign({}, state, action.payload);
        case core.SAVE_TO_STORE:
            return __assign({}, state, action.payload);
        default:
            return state;
    }
}
/**
 * Meta reducer for rehydrating state
 * @param myReducer
 * @returns {(state:any, action:any)=>(any|any)}
 */
export function rehydrateState(reducer) {
    return function (state, action) {
        if (action.type == REHYDRATE) {
            return __assign({}, action.payload, { router: fromRouter.routerReducer });
        }
        return reducer(state, action);
    };
}
/**
 * Selector returns current language
 */
export var getLanguage = function (state) { return state.language; };
/**
 * Selector returns current region
 */
export var getRegion = function (state) { return state.region; };
