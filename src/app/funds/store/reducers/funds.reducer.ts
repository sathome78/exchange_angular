import * as fromActions from '../actions/funds.actions';
import { defaultValues } from './default-values';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BalanceItem } from 'app/funds/models/balance-item.model';
import { PendingRequestsItem } from 'app/funds/models/pending-requests-item.model';
import { MyBalanceItem, MyBalanceItemSimple } from 'app/model/my-balance-item.model';
import { BalanceDetailsItem } from '../../models/balance-details-item.model';
import { TransactionHistoryItem } from 'app/funds/models/transactions-history-item.model';
import { IEOItem } from 'app/model/ieo.model';
import { QuberaBalanceModel } from 'app/model/qubera-balance.model';

export interface State {
  cryptoBal: BalanceItem[];
  quberaBal: { data: QuberaBalanceModel; error: any };
  countCryptoBal: number;
  fiatBal: BalanceItem[];
  countFiatBal: number;
  pendingRequests: PendingRequestsItem[];
  countPendingRequests: number;
  myBalances: MyBalanceItemSimple | null;
  balanceDetailsInfo: BalanceDetailsItem;
  loading: boolean;
  kycStatus: string;
  bankQuberaStatus: string;
  ieoBalances: IEOItem[];
  transactionsHistory: TransactionHistoryItem[];
  countTrHistory: number;
}

export const INIT_STATE: State = {
  cryptoBal: defaultValues.cryptoBal,
  quberaBal: defaultValues.quberaBal,
  countCryptoBal: defaultValues.countCryptoBal,
  fiatBal: defaultValues.fiatBal,
  bankQuberaStatus: null,
  countFiatBal: defaultValues.countFiatBal,
  pendingRequests: defaultValues.pendingRequests,
  countPendingRequests: defaultValues.countPendingRequests,
  myBalances: defaultValues.myBalances,
  transactionsHistory: defaultValues.transactionsHistory,
  countTrHistory: defaultValues.countTrHistory,
  kycStatus: defaultValues.kycStatus,
  ieoBalances: [],
  balanceDetailsInfo: null,
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
      return { ...state, loading: true };
    case fromActions.SET_CRYPTO_BAL:
      return {
        ...state,
        loading: false,
        cryptoBal: action.payload.items,
        countCryptoBal: action.payload.count,
      };
    case fromActions.SET_MORE_CRYPTO_BAL:
      return {
        ...state,
        loading: false,
        cryptoBal: [...state.cryptoBal, ...action.payload.items],
        countCryptoBal: action.payload.count,
      };
    case fromActions.FAIL_LOAD_CRYPTO_BAL:
      return {
        ...state,
        loading: false,
      };

    case fromActions.LOAD_FIAT_BAL:
      return { ...state, loading: true };
    case fromActions.SET_FIAT_BAL:
      return {
        ...state,
        loading: false,
        fiatBal: action.payload.items,
        countFiatBal: action.payload.count,
      };
    case fromActions.SET_MORE_FIAT_BAL:
      return {
        ...state,
        loading: false,
        fiatBal: [...state.fiatBal, ...action.payload.items],
        countFiatBal: action.payload.count,
      };
    case fromActions.FAIL_LOAD_FIAT_BAL:
      return {
        ...state,
        loading: false,
      };

    case fromActions.LOAD_QUBERA_BAL:
      return { ...state, loading: true };
    case fromActions.SET_QUBERA_BAL:
      return {
        ...state,
        loading: false,
        quberaBal: action.payload,
      };
    case fromActions.FAIL_LOAD_QUBERA_BAL:
      return {
        ...state,
        loading: false,
      };

    case fromActions.LOAD_BANK_QUBERA_STATUS:
      return { ...state, loading: true };
    case fromActions.SET_BANK_QUBERA_STATUS:
      return { ...state, bankQuberaStatus: action.payload };
    case fromActions.FAIL_LOAD_BANK_QUBERA_STATUS:
      return { ...state, loading: false };

    case fromActions.LOAD_QUBERA_KYC_STATUS:
      return { ...state, loading: true };
    case fromActions.SET_QUBERA_KYC_STATUS:
      return { ...state, kycStatus: action.payload.data };
    case fromActions.FAIL_LOAD_QUBERA_KYC_STATUS:
      return { ...state, loading: false };

    case fromActions.LOAD_PENDING_REQ:
      return { ...state, loading: true };
    case fromActions.SET_PENDING_REQ:
      return {
        ...state,
        loading: false,
        pendingRequests: action.payload.items,
        countPendingRequests: action.payload.count,
      };
    case fromActions.SET_MORE_PENDING_REQ:
      return {
        ...state,
        loading: false,
        pendingRequests: [...state.pendingRequests, ...action.payload.items],
        countPendingRequests: action.payload.count,
      };
    case fromActions.FAIL_LOAD_PENDING_REQ:
      return {
        ...state,
        loading: false,
      };

    case fromActions.LOAD_MY_BALANCES:
      return { ...state, loading: true };
    case fromActions.SET_MY_BALANCES:
      return {
        ...state,
        loading: false,
        myBalances: action.payload.data,
      };
    case fromActions.FAIL_LOAD_MY_BALANCES:
      return {
        ...state,
        loading: false,
      };

    case fromActions.LOAD_BALANCE_DETAILS_INFO:
      return { ...state, loading: true };
    case fromActions.SET_BALANCE_DETAILS_INFO:
      return {
        ...state,
        loading: false,
        balanceDetailsInfo: action.payload,
      };
    case fromActions.FAIL_LOAD_BALANCE_DETAILS_INFO:
      return { ...state, loading: false };

    // Transactions History

    case fromActions.LOAD_TRANSACTIONS_HISTORY:
      return { ...state, loading: true };
    case fromActions.LOAD_LAST_TRANSACTIONS_HISTORY:
      return { ...state, loading: true };
    case fromActions.SET_TRANSACTIONS_HISTORY:
      return {
        ...state,
        loading: false,
        transactionsHistory: action.payload.items,
        countTrHistory: action.payload.count,
      };
    case fromActions.SET_MORE_TRANSACTIONS_HISTORY:
      return {
        ...state,
        loading: false,
        transactionsHistory: [...state.transactionsHistory, ...action.payload.items],
        countTrHistory: action.payload.count,
      };
    case fromActions.FAIL_LOAD_TRANSACTIONS_HISTORY:
      return {
        ...state,
        loading: false,
      };
    case fromActions.SET_IEO_BALANCES:
      return {
        ...state,
        ieoBalances: setIEOBalances(state, action.payload),
      };

    default:
      return state;
  }
}

function setIEOBalances(state: State, newArr: IEOItem[]): IEOItem[] {
  const ieoData = [...state.ieoBalances];
  if (!newArr.length || !ieoData.length) {
    return newArr;
  }

  const index = ieoData.indexOf(ieoData.filter(f => f.id === newArr[0].id)[0]);
  if (index === -1) {
    ieoData.push(newArr[0]);
  } else {
    ieoData[index] = newArr[0];
  }
  return ieoData;
}

export const getFundsState = createFeatureSelector<State>('funds');

/** Crypto balances */

export const getCryptoBalances = (state: State): BalanceItem[] => state.cryptoBal;
export const getCountCryptoBal = (state: State): number => state.countCryptoBal;

export const getCryptoBalancesSelector = createSelector(
  getFundsState,
  getCryptoBalances
);
export const getCountCryptoBalSelector = createSelector(
  getFundsState,
  getCountCryptoBal
);

/** Fiat balances */

export const getFiatBalances = (state: State): BalanceItem[] => state.fiatBal;
export const getCountFiatBal = (state: State): number => state.countFiatBal;

export const getFiatBalancesSelector = createSelector(
  getFundsState,
  getFiatBalances
);
export const getCountFiatBalSelector = createSelector(
  getFundsState,
  getCountFiatBal
);

/** IEO balances */

export const getIEOBalances = (state: State): IEOItem[] => state.ieoBalances;
export const getIEOBalancesSelector = createSelector(
  getFundsState,
  getIEOBalances
);

/** Qubera balances */

export const getQuberaBalances = (state: State): any => state.quberaBal;

export const getQuberaBalancesSelector = createSelector(
  getFundsState,
  getQuberaBalances
);

/** Qubera KYC status */

export const getQuberaKycStatus = (state: State): string => state.kycStatus;

export const getQuberaKycStatusSelector = createSelector(
  getFundsState,
  getQuberaKycStatus
);

/** Pending requests */

export const getBalanceQuberaStatus = (state: State): string => state.bankQuberaStatus;

export const getBalanceStatus = createSelector(
  getFundsState,
  getBalanceQuberaStatus
);

export const getPendingRequests = (state: State): PendingRequestsItem[] => state.pendingRequests;
export const getCountPendingReq = (state: State): number => state.countPendingRequests;

export const getPendingRequestsSelector = createSelector(
  getFundsState,
  getPendingRequests
);
export const getCountPendingReqSelector = createSelector(
  getFundsState,
  getCountPendingReq
);

/** My Balances */

export const getMyBalances = (state: State): any => state.myBalances;
export const getMyBalancesSelector = createSelector(
  getFundsState,
  getMyBalances
);

/** Selected Balance Info */

export const getBalanceDetails = (state: State): any => state.balanceDetailsInfo;
export const getSelectedBalance = createSelector(
  getFundsState,
  getBalanceDetails
);

// /** Orders currencies pairs finish */

/** Transactions History */

export const getTrHistory = (state: State): TransactionHistoryItem[] => state.transactionsHistory;
export const getCountTrHistory = (state: State): number => state.countTrHistory;

export const getTrHistorySelector = createSelector(
  getFundsState,
  getTrHistory
);
export const getCountTrHistorySelector = createSelector(
  getFundsState,
  getCountTrHistory
);

// export const getAllCurrencyPairsSelector = (state: State): OrderCurrencyPair[] => state.currencyPairs;
export const getLoading = (state: State): boolean => state.loading;

/** Selector returns array of open orders filtered by currency*/
export const getLoadingSelector = createSelector(
  getFundsState,
  getLoading
);
