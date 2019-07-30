import * as dashboard from '../actions/dashboard.actions';
import {CurrencyPair} from '../../model/currency-pair.model';
import {UserBalance} from '../../model/user-balance.model';
import {
  defaultCurrencyPairInfo, defaultLastCreatedOrder,
  defaultLastPrice,
  defaultLastSellBuyOrder,
  defaultOrderItem,
  defaultUserBalance,
  defaultValues
} from './default-values';
import {OrderItem} from '../../model/order-item.model';
import {CurrencyPairInfo} from '../../model/currency-pair-info.model';
import {LastSellBuyOrder} from '../../model/last-sell-buy-order.model';
import {TradeItem} from '../../model/trade-item.model';
import {LastPrice} from '../../model/last-price.model';
import {Order} from '../../model/order.model';
import {SimpleCurrencyPair} from 'app/model/simple-currency-pair';

export interface State {
  activeCurrencyPair: SimpleCurrencyPair;
  currencyPairArray: CurrencyPair[];
  marketsCurrencyPairsMap: MapModel<CurrencyPair>;
  userBalance: UserBalance;
  selectedOrderBookOrder: OrderItem;
  currencyPairInfo: CurrencyPairInfo;
  lastSellBuyOrder: LastSellBuyOrder;
  lastCreatedOrder: Order;
  lastPrice: LastPrice;
  allTrades: TradeItem[];
  tradingType: string;
  userFavoritesCurrencyPairsIds: number[];
  openOrders;
  openOrdersCount: number;
  historyOrders;
  historyOrdersCount: number;
  ordersLoading: boolean;
  ordersBookBuyOrders: OrderItem[];
  ordersBookSellOrders: OrderItem[];
}

export const INIT_STATE: State = {
  activeCurrencyPair: defaultValues as SimpleCurrencyPair,
  currencyPairArray: [],
  userBalance: defaultUserBalance,
  selectedOrderBookOrder: defaultOrderItem as OrderItem,
  currencyPairInfo: defaultCurrencyPairInfo,
  lastSellBuyOrder: defaultLastSellBuyOrder,
  lastCreatedOrder: defaultLastCreatedOrder,
  allTrades: [],
  lastPrice: defaultLastPrice,
  tradingType: 'BUY',
  marketsCurrencyPairsMap: {},
  userFavoritesCurrencyPairsIds: [],
  openOrders: [],
  openOrdersCount: 0,
  historyOrders: [],
  historyOrdersCount: 0,
  ordersLoading: false,
  ordersBookBuyOrders: [],
  ordersBookSellOrders: [],
};

/**
 * Exports reducing function
 * @param state
 * @param action
 */
export function reducer(state: State = INIT_STATE, action: dashboard.Actions) {
  switch (action.type) {
    case dashboard.CHANGE_ACTIVE_CURRENCY_PAIR:
      if (action.payload.id === state.activeCurrencyPair.id) {
        return state;
      }
      return {
        ...state,
        activeCurrencyPair: action.payload
      };
    case dashboard.SET_CURRENCY_PAIRS_FOR_MARKET:
      return {
        ...state,
        marketsCurrencyPairsMap: createMarketsCurrencyPairsMap(state, action.payload),
      };
    case dashboard.SET_CURRENCY_PAIRS:
      return {
        ...state,
        currencyPairArray: action.payload,
      };
    case dashboard.SET_USER_FAVORITES_CURRENCY_PAIRS_FOR_MARKET:
      return {
        ...state,
        userFavoritesCurrencyPairsIds: action.payload,
      };
    case dashboard.TOGGLE_USER_FAVORITES_CURRENCY_PAIRS:
      return {
        ...state,
        userFavoritesCurrencyPairsIds: toggleUserFavorites(state, action.payload),
      };
    case  dashboard.REFRESH_USER_BALANCE:
      return {...state, userBalance: action.payload};
    case dashboard.SELECTED_ORDERBOOK_ORDER:
      return {...state, selectedOrderBookOrder: action.payload};
    case dashboard.SET_LAST_CREATED_ORDER:
      return {...state, lastCreatedOrder: action.payload};
      case dashboard.SET_TRADING_TYPE:
      return {...state, tradingType: action.payload};
    case dashboard.REFRESH_CURRENCY_PAIR_INFO:
      return {...state, currencyPairInfo: action.payload};
    case dashboard.SET_LAST_PRICE:
      return {...state, lastPrice: action.payload};
    case dashboard.SET_LAST_SELL_BUY_ORDER:
      return {...state, lastSellBuyOrder: action.payload};
    case dashboard.SET_ALL_TRADES:
      return {
        ...state,
        allTrades: action.payload,
      };
    case dashboard.LOAD_OPEN_ORDERS:
    case dashboard.LOAD_HISTORY_ORDERS:
      return {
        ...state,
        ordersLoading: true,
      };
    case dashboard.FAIL_OPEN_ORDERS:
    case dashboard.FAIL_HISTORY_ORDERS:
      return {
        ...state,
        ordersLoading: false,
      };
    case dashboard.SET_HISTORY_ORDERS:
      return {
        ...state,
        historyOrders: action.payload.historyOrders,
        historyOrdersCount: action.payload.count,
        ordersLoading: false,
      };
    case dashboard.SET_OPEN_ORDERS:
      return {
        ...state,
        openOrders: action.payload.openOrders,
        openOrdersCount: action.payload.count,
        ordersLoading: false,
      };
    case dashboard.SET_ORDERS_BOOK_BUY_DATA:
      return {
        ...state,
        ordersBookBuyOrders: action.payload,
      };
    case dashboard.SET_ORDERS_BOOK_SELL_DATA:
      return {
        ...state,
        ordersBookSellOrders: action.payload,
      };
    default :
      return state;
  }
}

function createMarketsCurrencyPairsMap(state: State, newPairs: CurrencyPair[]): MapModel<CurrencyPair> {
  const map = {
    ...state.marketsCurrencyPairsMap,
  };
  newPairs.forEach((cp) => {
    if (map[cp.currencyPairId]) {
      map[cp.currencyPairId] = {
        ...map[cp.currencyPairId],
        ...cp,
      };
    } else {
      map[cp.currencyPairId] = cp;
    }
  });
  return map;
}

function toggleUserFavorites(state: State, currencyPairId: number) {
  const newArr = [...state.userFavoritesCurrencyPairsIds];
  const index = newArr.indexOf(currencyPairId);
  if (index < 0) {
    newArr.push(currencyPairId);
  } else {
    newArr.splice(index, 1);
  }
  return newArr;
}


/** Selector returns current currency pair*/
export const getActiveCurrencyPairSelector = (state: State): SimpleCurrencyPair => state.activeCurrencyPair;

/** Selector returns user favorites currency pairs*/
export const getFavoritesCurrencyPairSelector = (state: State): number[] => state.userFavoritesCurrencyPairsIds;

/** Selector returns array of currency pairs */
export const getCurrencyPairArray = (state: State): CurrencyPair[] => state.currencyPairArray;
export const getMarketCurrencyPairsArraySelector = (state: State): MapModel<CurrencyPair> => state.marketsCurrencyPairsMap;

/** Selector returns current user balance */
export const getUserBalance = (state: State): UserBalance => state.userBalance;

/** Selector returns selected order-book order */
export const getSelectedOrderBookOrder = (state: State): OrderItem => state.selectedOrderBookOrder;

/** Selector returns currency pair info */
export const getCurrencyPairInfo = (state: State): CurrencyPairInfo => state.currencyPairInfo;

/** Selector returns last sell/buy orders */
export const getLastSellBuyOrder = (state: State): LastSellBuyOrder => state.lastSellBuyOrder;

/** Selector returns all trades */
export const getAllTrades = (state: State): TradeItem[] => state.allTrades;

/** Selector returns trading type*/
export const getTradingType = (state: State): string => state.tradingType;

/** Selector returns pair last price*/
export const getLastPrice = (state: State): LastPrice => state.lastPrice;

/** Selector returns last created order*/
export const getLastCreatedOrder = (state: State): Order => state.lastCreatedOrder;

/** Selector returns open orders*/
export const getOpenOrders = (state: State) => state.openOrders;

/** Selector returns open orders*/
export const getOpenOrdersCount = (state: State) => state.openOrdersCount;

/** Selector returns open orders*/
export const getHistoryOrders = (state: State) => state.historyOrders;

/** Selector returns open orders*/
export const getOrdersLoading = (state: State) => state.ordersLoading;


/** Selector returns orders book buy item*/
export const getOrdersBookBuy = (state: State) => state.ordersBookBuyOrders;
/** Selector returns orders book sell item*/
export const getOrdersBookSell = (state: State) => state.ordersBookSellOrders;
