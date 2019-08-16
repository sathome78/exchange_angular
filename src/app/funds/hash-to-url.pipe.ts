import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hashToUrl',
})
export class HashToUrlPipe implements PipeTransform {
  private currencies = ['BTC', 'ETH', 'LTC', 'XRP', 'BCH', 'BSV', 'DASH', 'DOGE'];

  transform(hash: string = '', currency: string): string {
    const prefix = this.getUrlPrefix(currency);
    if (hash && prefix) {
      return `
      <a
        class="transaction-hash-link"
        href="${prefix}${hash}"
        target="_blank"
        rel="nofollow noopener noreferrer"
        alt="${prefix}${hash}"
      >
        ${hash}
      </a>`;
    }
    return `<span>${hash || ''}</span>`;
  }

  getUrlPrefix(currency) {
    switch (currency) {
      case 'BTC':
        return 'https://blockchair.com/bitcoin/transaction/';
      case 'ETH':
        return 'https://blockchair.com/ethereum/transaction/';
      case 'LTC':
        return 'https://blockchair.com/litecoin/transaction/';
      case 'XRP':
        return 'https://blockchair.com/ripple/transaction/';
      case 'BCH':
        return 'https://blockchair.com/bitcoin-cash/transaction/';
      case 'BSV':
        return 'https://blockchair.com/bitcoin-sv/transaction/';
      case 'DASH':
        return 'https://blockchair.com/dash/transaction/';
      case 'DOGE':
        return 'https://blockchair.com/dogecoin/transaction/';
      case 'GRS':
        return 'https://blockchair.com/groestlcoin/transaction/';
      default:
        return null;
    }
  }
}
