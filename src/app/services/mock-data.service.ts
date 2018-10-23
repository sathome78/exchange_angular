import {Injectable} from '@angular/core';

@Injectable()
export class MockDataService {

  private marketsData = [
    {
      needRefresh: false,
      page: 1,
      currencyPairId: 1,
      currencyPairName: 'JHG/BTC',
      lastOrderRate: 0.0000044,
      predLastOrderRate: 0.0000033,
      percentChange: '0.3',
      market: 'BTC',
      description: 'description',
      volume: '9 511.31660052'
    },
    {
      needRefresh: false,
      page: 1,
      currencyPairId: 1,
      currencyPairName: 'LUY/BTC',
      lastOrderRate: 0.0000055,
      predLastOrderRate: 0.0000033,
      percentChange: '0.3',
      market: 'BTC',
      description: 'description',
      volume: '9 511.31660052'
    },
    {
      needRefresh: false,
      page: 1,
      currencyPairId: 122,
      currencyPairName: 'USD/BTC',
      lastOrderRate: 0.5,
      predLastOrderRate: 0.6,
      percentChange: '1.3',
      market: 'BTC',
      description: 'description',
      volume: '9 511.3166'
    },
    {
      needRefresh: false,
      page: 1,
      currencyPairId: 1,
      currencyPairName: 'MFT/ETH',
      lastOrderRate: 0.0000022,
      predLastOrderRate: 0.0000011,
      percentChange: '0.4',
      market: 'ETH',
      description: 'description',
      volume: '9 511.360052'
    },
    {
      needRefresh: false,
      page: 1,
      currencyPairId: 2,
      currencyPairName: 'KJH/ETH',
      lastOrderRate: 0.0000044,
      predLastOrderRate: 0.0000033,
      percentChange: '0.3',
      market: 'ETH',
      description: 'description',
      volume: '9 511.3152'
    },
    {
      needRefresh: false,
      page: 1,
      currencyPairId: 1,
      currencyPairName: 'UYI/ETH',
      lastOrderRate: 0.0000055,
      predLastOrderRate: 0.0000033,
      percentChange: '0.3',
      market: 'ETH',
      description: 'description',
      volume: '9 511.3152'
    },
    {
      needRefresh: false,
      page: 1,
      currencyPairId: 1,
      currencyPairName: 'AHG/ETH',
      lastOrderRate: 0.0000022,
      predLastOrderRate: 0.0000099,
      percentChange: '1.3',
      market: 'ETH',
      description: 'description',
      volume: '9 511.31052'
    },
    {
      needRefresh: false,
      page: 1,
      currencyPairId: 1,
      currencyPairName: 'JYF/ETH',
      lastOrderRate: 0.0000022,
      predLastOrderRate: 0.0000011,
      percentChange: '0.4',
      market: 'ETH',
      description: 'description',
      volume: '9 511.30052'
    },
    {
      needRefresh: false,
      page: 1,
      currencyPairId: 1,
      currencyPairName: 'JHG/LOC',
      lastOrderRate: 0.0000044,
      predLastOrderRate: 0.0000033,
      percentChange: '0.3',
      market: 'LOC',
      description: 'description',
      volume: '9 511.3166'
    },
    {
      needRefresh: false,
      page: 1,
      currencyPairId: 1,
      currencyPairName: 'LUY/LOC',
      lastOrderRate: 0.0000055,
      predLastOrderRate: 0.0000033,
      percentChange: '0.3',
      market: 'LOC',
      description: 'description',
      volume: '9 51.3100'
    },
    {
      needRefresh: false,
      page: 1,
      currencyPairId: 1,
      currencyPairName: 'DRR/LOC',
      lastOrderRate: 0.0000022,
      predLastOrderRate: 0.0000099,
      percentChange: '1.3',
      market: 'LOC',
      description: 'description',
      volume: '9 511.31652'
    },
    {
      needRefresh: false,
      page: 1,
      currencyPairId: 1,
      currencyPairName: 'MFT/LOC',
      lastOrderRate: 0.0000022,
      predLastOrderRate: 0.0000011,
      percentChange: '0.4',
      market: 'LOC',
      description: 'description',
      volume: '9 511.3052'
    },
    {
      needRefresh: false,
      page: 1,
      currencyPairId: 2,
      currencyPairName: 'KJH/USD',
      lastOrderRate: 0.0000044,
      predLastOrderRate: 0.0000033,
      percentChange: '0.3',
      market: 'USD',
      description: 'description',
      volume: '9 511.3152'
    },
    {
      needRefresh: false,
      page: 1,
      currencyPairId: 1,
      currencyPairName: 'UYI/USD',
      lastOrderRate: 0.0000055,
      predLastOrderRate: 0.0000033,
      percentChange: '0.3',
      market: 'USD',
      description: 'description',
      volume: '9 511.60052'
    },
    {
      needRefresh: false,
      page: 1,
      currencyPairId: 1,
      currencyPairName: 'KHG/USD',
      lastOrderRate: 0.0000022,
      predLastOrderRate: 0.0000099,
      percentChange: '1.3',
      market: 'USD',
      description: 'description',
      volume: '9 511.316'
    },
    {
      needRefresh: false,
      page: 1,
      currencyPairId: 1,
      currencyPairName: 'JYF/USD',
      lastOrderRate: 0.0000022,
      predLastOrderRate: 0.0000011,
      percentChange: '0.4',
      market: 'USD',
      description: 'description',
      volume: '9 511.052'
    }
  ];
  private openOrdersData = [
    {
      orderId: 215487885451,
      created: new Date(),
      type: 'Buy (Limit)',
      averagePrice: '4500',
      amount: '0.005',
      commission: '0.02',
      total: 6000
    },
    {
      orderId: 215487885451,
      created: new Date(),
      type: 'Buy (Limit)',
      averagePrice: '4700',
      amount: '0.105',
      commission: '0.052',
      total: 800
    },
    {
      orderId: 215487885451,
      created: new Date(),
      type: 'Buy (Limit)',
      averagePrice: '4500',
      amount: '0.005',
      commission: '0.02',
      total: 6000
    },
    {
      orderId: 215487885451,
      created: new Date(),
      type: 'Buy (Limit)',
      averagePrice: '4700',
      amount: '0.105',
      commission: '0.052',
      total: 800
    },
    {
      orderId: 215487885451,
      created: new Date(),
      type: 'Buy (Limit)',
      averagePrice: '4500',
      amount: '0.005',
      commission: '0.02',
      total: 6000
    },
    {
      orderId: 215487885451,
      created: new Date(),
      type: 'Buy (Limit)',
      averagePrice: '4700',
      amount: '0.105',
      commission: '0.052',
      total: 800
    },
    {
      orderId: 215487885451,
      created: new Date(),
      type: 'Buy (Limit)',
      averagePrice: '4500',
      amount: '0.005',
      commission: '0.02',
      total: 6000
    },
    {
      orderId: 215487885451,
      created: new Date(),
      type: 'Buy (Limit)',
      averagePrice: '4700',
      amount: '0.105',
      commission: '0.052',
      total: 800
    }
  ]

  getMarketsData() {
    return this.marketsData;
  }

  getOpenOrders() {
    return this.openOrdersData;
  }

}
