import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getIconUrl'
})
export class GetIconUrl  implements PipeTransform {
  transform(name: string): string {

    switch (name) {
      case 'DIGIT':
      case 'DOR':
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
      case 'EDT':
      case 'HT':
      case 'CTX':
      case 'LiqPay':
      case 'Privat24':
      case 'Invoice':
      case 'Visa':
      case 'Master Card':
      case 'Interkassa':
        name = 'no_icon';
        break;
    }
    const iconSrc = `assets/img/currency-icons/${name.toLowerCase()}.svg`;
    return iconSrc;
  }
}
