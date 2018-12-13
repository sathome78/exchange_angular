import * as fromActions from '../actions/funds.actions';
import {defaultValues} from './default-values';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {BalanceItem} from 'app/funds/models/balance-item.model';
import {PendingRequestsItem} from 'app/funds/models/pending-requests-item.model';
import { MyBalanceItem } from 'app/funds/models/my-balance-item.model';

export interface State {
  cryptoBal: BalanceItem[];
  countCryptoBal: number;
  fiatBal: BalanceItem[];
  countFiatBal: number;
  pendingRequests: PendingRequestsItem[];
  countPendingRequests: number;
  myBalances: MyBalanceItem, 
  loading: boolean;
}

export const INIT_STATE: State = {
  cryptoBal: defaultValues.cryptoBal,
  countCryptoBal: defaultValues.countCryptoBal,
  fiatBal: defaultValues.fiatBal,
  countFiatBal: defaultValues.countFiatBal,
  pendingRequests: defaultValues.pendingRequests,
  countPendingRequests: defaultValues.countPendingRequests,
  myBalances: defaultValues.myBalances,
  loading: false,
};

/**
 * Exports reducing function
 * @param state
 * @param action
 */
export function reducer(state: State = INIT_STATE, action: fromActions.Actions) {
  switch (action.type) {
    case fromActions.LOAD_CRYPTO_BAL:
      return {...state, loading: true};
    case fromActions.SET_CRYPTO_BAL:
      if(action.payload.isMobile) {
        return {
          ...state, 
          loading: false, 
          cryptoBal: [...state.cryptoBal, ...action.payload.items], 
          countCryptoBal: action.payload.count,
        };
      }
      return {
        ...state, 
        loading: false, 
        cryptoBal: action.payload.items, 
        countCryptoBal: action.payload.count,
      };
    case fromActions.FAIL_LOAD_CRYPTO_BAL:
      return {
        ...state, 
        loading: false, 
      };

    case fromActions.LOAD_FIAT_BAL:
      return {...state, loading: true};
    case fromActions.SET_FIAT_BAL:
      return {
        ...state, 
        loading: false, 
        fiatBal: action.payload.items, 
        countFiatBal: action.payload.count,
      };
    case fromActions.FAIL_LOAD_FIAT_BAL:
      return {
        ...state, 
        loading: false, 
      };

    case fromActions.LOAD_PENDING_REQ:
      return {...state, loading: true};
    case fromActions.SET_PENDING_REQ:
      return {
        ...state, 
        loading: false, 
        pendingRequests: action.payload.items, 
        countPendingRequests: action.payload.count,
      };
    case fromActions.FAIL_LOAD_PENDING_REQ:
      return {
        ...state, 
        loading: false, 
      };

    case fromActions.LOAD_MY_BALANCES:
      return {...state, loading: true};
    case fromActions.SET_MY_BALANCES:
      return {
        ...state, 
        loading: false, 
        myBalances: action.payload, 
      };
    case fromActions.FAIL_LOAD_MY_BALANCES:
      return {
        ...state, 
        loading: false, 
      };

    default :
      return state;
  }
}

export const getOrdersState = createFeatureSelector<State>('funds');

/** Crypto balances */

export const getCryptoBalances = (state: State): BalanceItem[] => state.cryptoBal;
export const getCountCryptoBal = (state: State): number => state.countCryptoBal;

export const getCryptoBalancesSelector = createSelector(getOrdersState, getCryptoBalances);
export const getCountCryptoBalSelector = createSelector(getOrdersState, getCountCryptoBal);

/** Fiat balances */

export const getFiatBalances = (state: State): BalanceItem[] => state.fiatBal;
export const getCountFiatBal = (state: State): number => state.countFiatBal;

export const getFiatBalancesSelector = createSelector(getOrdersState, getFiatBalances);
export const getCountFiatBalSelector = createSelector(getOrdersState, getCountFiatBal);

/** Pending requests */

export const getPendingRequests = (state: State): PendingRequestsItem[] => state.pendingRequests;
export const getCountPendingReq = (state: State): number => state.countPendingRequests;

export const getPendingRequestsSelector = createSelector(getOrdersState, getPendingRequests);
export const getCountPendingReqSelector = createSelector(getOrdersState, getCountPendingReq);

/** My Balances */

export const getMyBalances = (state: State): any => state.myBalances;
export const getMyBalancesSelector = createSelector(getOrdersState, getMyBalances);


