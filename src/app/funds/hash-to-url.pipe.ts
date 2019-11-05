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
      case 'ADB':
      case 'AMN':
      case 'ASG':
      case 'BAT':
      case 'BEZ':
      case 'BIO':
      case 'BNB':
      case 'BRC':
      case 'CEEK':
      case 'CMIT':
      case 'CRBT':
      case 'CZO':
      case 'DACC':
      case 'DGTX':
      case 'DTRC':
      case 'ECHT':
      case 'ECTE':
      case 'ELT':
      case 'EMBR':
      case 'eMTV':
      case 'ETA':
      case 'FSBT':
      case 'FST':
      case 'FTO':
      case 'GAPI':
      case 'GEX':
      case 'GIGC':
      case 'GNT':
      case 'GNY':
      case 'GST':
      case 'HDR':
      case 'HNI':
      case 'HOT':
      case 'HST':
      case 'HT':
      case 'INK':
      case 'INO':
      case 'IQN':
      case 'KAT':
      case 'KWATT':
      case 'LEDU':
      case 'MANA':
      case 'MASP':
      case 'MCO':
      case 'MET':
      case 'MEXC':
      case 'MFTU':
      case 'MNC':
      case 'MODL':
      case 'MTC':
      case 'MTL':
      case 'NAC':
      case 'NBC':
      case 'NBTK':
      case 'NIO':
      case 'NOVA':
      case 'NPXS':
      case 'OMG':
      case 'ORME':
      case 'PAT':
      case 'PLTC':
      case 'QKC':
      case 'QUiNT':
      case 'RDN':
      case 'REB':
      case 'REN':
      case 'REP':
      case 'RNTB':
      case 'RTH':
      case 'RVC':
      case 'RVT':
      case 'S4F':
      case 'SIM':
      case 'SPD':
      case 'STOR':
      case 'SWM':
      case 'TAVITT':
      case 'TCAT':
      case 'TIC':
      case 'TTC':
      case 'TTT':
      case 'TUSD':
      case 'UCASH':
      case 'UNC':
      case 'UQC':
      case 'USDC':
      case 'VRA':
      case 'WTL':
      case 'ZRX':
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
