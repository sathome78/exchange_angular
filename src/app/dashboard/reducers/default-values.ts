import {OrderItem} from '../../model/order-item.model';

export const defaultValues = {
  page: 0,
  currencyPairId: 0,
  currencyPairName: '',
  lastOrderRate: 0,
  predLastOrderRate: 0,
  percentChange: 0,
  priceInUSD: 0,
  market: '',
  volume: 0,
};

export const defaultUserBalance = {
  balanceByCurrency1: null,
  balanceByCurrency2: null,
}

export const defaultOrderItem = {
  needRefresh: false,
  page: 0,
  id: 0,
  userId: 0,
  orderType: '',
  exrate: 0,
  amountBase: 0,
  amountConvert: 0,
  created: new Date('1/1/1990'),
  accepted: new Date('1/1/1990'),
  ordersIds: ''
}

export const defaultCurrencyPairInfo = {
  changedValue: 0,
  currencyRate: 0,
  lastCurrencyRate: 0,
  percentChange: 0,
  rateHigh: 0,
  rateLow: 0,
  volume24h: 0,
}

export const defaultTradeItem = {
  acceptionTime: '0',
  amountBase: '0',
  dateAcceptionTime: '12:05:03',
  needRefresh: true,
  operationType: 'SELL',
  orderId: 0,
  page: 0,
  rate: '0'
}

export const defaultLastSellBuyOrder = {
  lastOrder: defaultTradeItem,
  lastSellOrder: defaultTradeItem,
  lastBuyOrder: defaultTradeItem
}

