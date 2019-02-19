export const defaultValues = {
  page: 0,
  currencyPairId: 1,
  currencyPairName: 'BTC/USD',
  lastOrderRate: 0,
  predLastOrderRate: 0,
  percentChange: 0,
  priceInUsd: 0,
  market: '',
  volume: 0,
};

export const defaultUserBalance = {
  cur1: null,
  cur2: null,
}

export const defaultOrderItem = {
  amount: '0',
  currencyPairId: 1,
  exrate: '0',
  orderType: 'BUY',
  total: '0'
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

export const defaultLastPrice = {
  flag: true,
  price: 0
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

export const defaultLastCreatedrder = {
  orderType: '',
  orderId: 0,
  currencyPairId: 0,
  amount: 0,
  rate: 0,
  commission: 0,
  baseType: '',
  total: 0,
  status: '',
  stop: 0
}

export const defaultLastSellBuyOrder = {
  lastOrder: defaultTradeItem,
  lastSellOrder: defaultTradeItem,
  lastBuyOrder: defaultTradeItem
}

