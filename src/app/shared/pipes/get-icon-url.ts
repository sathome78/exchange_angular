import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getIconUrl'
})
export class GetIconUrl  implements PipeTransform {
  transform(name: string): string {

    switch (name) {
      case '':
      case 'DIGIT':
      case 'DOR':
      case 'BAB':
      case 'CMS_X':
      case 'ECTE':
      case 'EXR':
      case 'GRS':
      case 'KOD':
      case 'MANA':
      case 'MCO':
      case 'POA':
      case 'TAO':
      case 'WaBi':
      case 'ZIL':
      case 'DTC':
      case 'ECT':
      case 'ENGT':
      case 'CMS_E':
      case 'MODL':
      case 'QUICK':
      case 'BCHABC':
      case 'BSV':
      case 'TRS':
      case 'VNT':
      case 'AED':
      case 'RUB':
      case 'RIME':
      case 'TCAT':
      case 'EDT':
      case 'EXO':
      case 'HT':
      case 'CTX':
      case 'LiqPay':
      case 'Privat24':
      case 'Invoice':
      case 'Visa':
      case 'Master Card':
      case 'Interkassa':
      case 'Privat24 Payment':
      case 'QIWI':
      case 'Mir Payment':
      case 'Yandex Money':
      case 'Alfaclick Payment':
      case 'BAT':
      case 'BTT':
      case 'CSC':
      case 'DIM.EUR':
      case 'DIM.USD':
      case 'DIVI':
      case 'ELC':
      case 'HCXP':
      case 'HNI':
      case 'HOT':
      case 'MET':
      case 'NPXS':
      case 'OWC':
      case 'PLTC':
      case 'PPY':
      case 'QKC':
      case 'RDN':
      case 'REN':
      case 'USDT':
      case 'VRBS':
      case 'WOLF':
      case 'ZRX':
      case 'ZUBE':
        name = 'no_icon';
        break;
    }
    const iconSrc = `assets/img/currency-icons/${name.toLowerCase()}.svg`;
    return iconSrc;
  }
}
