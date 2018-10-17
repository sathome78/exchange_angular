import {Injectable} from '@angular/core';

@Injectable()
export class MockDataService {

  private marketsData = [
    {
      favorite: true,
      pairA: 'MFT',
      pairB: 'BTC',
      priceIn: '0.00000290',
      changePercent: '0.1',
      changeUp: true,
      volume: '9 511.31660052'
    },
    {
      favorite: false,
      pairA: 'ETH',
      pairB: 'BTC',
      priceIn: '0.00000291',
      changePercent: '0.2',
      changeUp: true,
      volume: '535.16809811'
    },
    {
      favorite: true,
      pairA: 'ETH',
      pairB: 'BTC',
      priceIn: '0.00000292',
      changePercent: '0.3',
      changeUp: true,
      volume: '232335.16809811'
    },
    {
      favorite: false,
      pairA: 'EOS',
      pairB: 'BTC',
      priceIn: '0.00000293',
      changePercent: '0.4',
      changeUp: false,
      volume: '535.16809811'
    },
    {
      favorite: true,
      pairA: 'EOS',
      pairB: 'BTC',
      priceIn: '0.00000294',
      changePercent: '0.5',
      changeUp: true,
      volume: '535.16809811'
    },
    {
      favorite: false,
      pairA: 'MFT',
      pairB: 'BTC',
      priceIn: '0.00000295',
      changePercent: '0.6',
      changeUp: false,
      volume: '535.16809813453'
    },
    {
      favorite: true,
      pairA: 'MFT',
      pairB: 'BTC',
      priceIn: '0.00000290',
      changePercent: '0.1',
      changeUp: true,
      volume: '9 511.31660052'
    },
    {
      favorite: false,
      pairA: 'ETH',
      pairB: 'BTC',
      priceIn: '0.00000291',
      changePercent: '0.2',
      changeUp: true,
      volume: '535.16809811'
    },
    {
      favorite: true,
      pairA: 'ETH',
      pairB: 'BTC',
      priceIn: '0.00000292',
      changePercent: '0.3',
      changeUp: true,
      volume: '232335.16809811'
    },
    {
      favorite: false,
      pairA: 'EOS',
      pairB: 'BTC',
      priceIn: '0.00000293',
      changePercent: '0.4',
      changeUp: false,
      volume: '535.16809811'
    },
    {
      favorite: true,
      pairA: 'EOS',
      pairB: 'BTC',
      priceIn: '0.00000294',
      changePercent: '0.5',
      changeUp: true,
      volume: '535.16809811'
    },
    {
      favorite: false,
      pairA: 'MFT',
      pairB: 'BTC',
      priceIn: '0.00000295',
      changePercent: '0.6',
      changeUp: false,
      volume: '535.16809813453'
    },
    {
      favorite: true,
      pairA: 'ETH',
      pairB: 'BTC',
      priceIn: '0.00000292',
      changePercent: '0.3',
      changeUp: true,
      volume: '232335.16809811'
    },
    {
      favorite: false,
      pairA: 'EOS',
      pairB: 'BTC',
      priceIn: '0.00000293',
      changePercent: '0.4',
      changeUp: false,
      volume: '535.16809811'
    },
    {
      favorite: true,
      pairA: 'EOS',
      pairB: 'BTC',
      priceIn: '0.00000294',
      changePercent: '0.5',
      changeUp: true,
      volume: '535.16809811'
    },
    {
      favorite: false,
      pairA: 'MFT',
      pairB: 'BTC',
      priceIn: '0.00000295',
      changePercent: '0.6',
      changeUp: false,
      volume: '535.16809813453'
    },
    {
      favorite: true,
      pairA: 'MFT',
      pairB: 'BTC',
      priceIn: '0.00000290',
      changePercent: '0.1',
      changeUp: true,
      volume: '9 511.31660052'
    },
    {
      favorite: false,
      pairA: 'ETH',
      pairB: 'BTC',
      priceIn: '0.00000291',
      changePercent: '0.2',
      changeUp: true,
      volume: '535.16809811'
    },
    {
      favorite: true,
      pairA: 'ETH',
      pairB: 'BTC',
      priceIn: '0.00000292',
      changePercent: '0.3',
      changeUp: true,
      volume: '232335.16809811'
    },
    {
      favorite: false,
      pairA: 'EOS',
      pairB: 'BTC',
      priceIn: '0.00000293',
      changePercent: '0.4',
      changeUp: false,
      volume: '535.16809811'
    },
    {
      favorite: true,
      pairA: 'EOS',
      pairB: 'BTC',
      priceIn: '0.00000294',
      changePercent: '0.5',
      changeUp: true,
      volume: '535.16809811'
    },
    {
      favorite: false,
      pairA: 'MFT',
      pairB: 'BTC',
      priceIn: '0.00000295',
      changePercent: '0.6',
      changeUp: false,
      volume: '535.16809813453'
    },
    {
      favorite: true,
      pairA: 'MFT',
      pairB: 'BTC',
      priceIn: '0.00000290',
      changePercent: '0.1',
      changeUp: true,
      volume: '9 511.31660052'
    },
    {
      favorite: false,
      pairA: 'ETH',
      pairB: 'BTC',
      priceIn: '0.00000291',
      changePercent: '0.2',
      changeUp: true,
      volume: '535.16809811'
    },
    {
      favorite: false,
      pairA: 'ETH',
      pairB: 'BTC',
      priceIn: '0.00000291',
      changePercent: '0.2',
      changeUp: true,
      volume: '535.16809811'
    },
  ];

  getMarketsData() {
    return this.marketsData;
  }

}
