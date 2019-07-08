import * as coreActions from '../actions/core.actions';
// import {ActionReducer, createSelector} from '@ngrx/store';
// import {REHYDRATE, RehydrateAction} from '../actions/core.actions';
import {SimpleCurrencyPair} from '../../model/simple-currency-pair';
import {CurrencyChoose} from '../../model/currency-choose.model';
import {IEOItem} from 'app/model/ieo.model';
import {DetailedCurrencyPair} from 'app/model/detailed-currency-pair';

export interface State {
  currency: string;
  region: string;
  language: string;
  verificationStatus: string;
  bankQuberaStatus: string;
  simpleCurrencyPairs: SimpleCurrencyPair[];
  detailedCurrencyPairs: DetailedCurrencyPair[];
  cryptoCurrenciesForChoose: CurrencyChoose[];
  fiatCurrenciesForChoose: CurrencyChoose[];
  allCurrenciesForChoose: CurrencyChoose[];
  loading: boolean;
  isAuthenticated: boolean;
  userInfo: ParsedToken;
  ieoList: IEOItem[];
}

export const INIT_STATE: State = {
  currency: null,
  region: null,
  language: 'en',
  verificationStatus: null,
  bankQuberaStatus: null,
  simpleCurrencyPairs: [],
  detailedCurrencyPairs: [],
  cryptoCurrenciesForChoose: [],
  fiatCurrenciesForChoose: [],
  allCurrenciesForChoose: [],
  loading: false,
  isAuthenticated: false,
  userInfo: null,
  ieoList: [],
};

/**
 * Exports reducing function
 * @param state
 * @param action
 */
export function reducer(state: State = INIT_STATE, action: coreActions.Actions) {
  switch (action.type) {
    case coreActions.SAVE_COMPLETE:
      return {...state, ...action.payload};

    case coreActions.SAVE_TO_STORE:
      return {...state, ...action.payload};

    case coreActions.CHANGE_LANGUAGE:
      // console.log(action.payload)
      return {...state, language: action.payload};

    case coreActions.LOAD_VERIFICATION_STATUS:
      return {...state, loading: true};
    case coreActions.SET_VERIFICATION_STATUS:
      return {...state, verificationStatus: action.payload};
    case coreActions.FAIL_LOAD_VERIFICATION_STATUS:
      return {...state, loading: false};

    case coreActions.LOAD_BANK_QUBERA_STATUS:
      return {...state, loading: true};
    case coreActions.SET_BANK_QUBERA_STATUS:
      return {...state, bankQuberaStatus: action.payload};
    case coreActions.FAIL_LOAD_BANK_QUBERA_STATUS:
      return {...state, loading: false};

    case coreActions.SET_SIMPLE_CURRENCY_PAIRS:
      return {
        ...state,
        simpleCurrencyPairs: action.payload.simpleItems,
        detailedCurrencyPairs: action.payload.detailedItems,
      };
    case coreActions.LOAD_ALL_CURRENCIES_FOR_CHOOSE:
      return {...state, loading: true};
    case coreActions.LOAD_CRYPTO_CURRENCIES_FOR_CHOOSE:
      return {...state, loading: true};
    case coreActions.LOAD_FIAT_CURRENCIES_FOR_CHOOSE:
      return {...state, loading: true};
    case coreActions.SET_ALL_CURRENCIES_FOR_CHOOSE:
      return {...state, allCurrenciesForChoose: action.payload};
    case coreActions.SET_CRYPTO_CURRENCIES_FOR_CHOOSE:
      return {...state, cryptoCurrenciesForChoose: action.payload};
    case coreActions.SET_FIAT_CURRENCIES_FOR_CHOOSE:
      return {...state, fiatCurrenciesForChoose: action.payload};
    case coreActions.FAIL_LOAD_CURRENCIES_FOR_CHOOSE:
      return {...state, loading: false};

    case coreActions.ON_LOGIN:
      return {...state, userInfo: action.payload, isAuthenticated: true};
    case coreActions.ON_LOGOUT:
      return {...state, userInfo: null, isAuthenticated: false};
    case coreActions.SET_IEO_LIST:
      const cacheIeoList = [...state.ieoList];
      action.payload.forEach((i) => {
        const itemIndex = cacheIeoList.findIndex((ci) => ci.id === i.id);
        if (itemIndex >= 0) {
          cacheIeoList[itemIndex] = i;
        } else {
          cacheIeoList.push(i);
        }
      });
      return {...state, ieoList: cacheIeoList};

    default:
      return state;
  }
}
/*

/!**
 * Meta reducer for rehydrating state
 * @param myReducer
 * @returns {(state:any, action:any)=>(any|any)}
 *!/
export function rehydrateState(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    if (action.type == REHYDRATE) {
      return {...(<RehydrateAction>action).payload, router : fromRouter.routerReducer};
    }
    return reducer(state, action);
  };
}
*/

/**
 * Selector returns current language
 */
export const getLanguage = (state: State): string => state.language;
export const getVerificationStatus = (state: State): string => state.verificationStatus;
export const getBalanceQuberaStatus = (state: State): string => state.verificationStatus;

/**
 * Selector returns current region
 */
export const getRegion = (state: State): string => state.region;


export const getAllSimpleCurrencyPairs = (state: State): SimpleCurrencyPair[] => state.simpleCurrencyPairs;
export const getAllDetailedCurrencyPairs = (state: State): DetailedCurrencyPair[] => state.detailedCurrencyPairs;
/** Selector returns crypto and fiat currencies for choose in dropdown*/
export const getAllCurrenciesForChoose = (state: State): CurrencyChoose[] => state.allCurrenciesForChoose;
/** Selector returns crypto currencies for choose in dropdown*/
export const getCryptoCurrenciesForChoose = (state: State): CurrencyChoose[] => state.cryptoCurrenciesForChoose;
/** Selector returns fiat currencies for choose in dropdown*/
export const getFiatCurrenciesForChoose = (state: State): CurrencyChoose[] => state.fiatCurrenciesForChoose;

/** Selector return is Authenticated */
export const getIsAuthenticatedSelector = (state: State): boolean => state.isAuthenticated;
/** Selector return is Authenticated */
export const getUserInfoSelector = (state: State): ParsedToken => state.userInfo;
export const getIEOListSelector = (state: State): IEOItem[] => state.ieoList;
