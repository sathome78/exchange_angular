import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getIconUrl'
})
export class GetIconUrl  implements PipeTransform {
  transform(name: string): string {

    switch (name) {
      case 'DIGIT':
      case 'DIME':
      case 'DOR':
      case 'DTC':
      case 'ECT':
      case 'ENGT':
      case 'CMS_E':
      case 'MGX':
      case 'MNC':
      case 'MODL':
      case 'QUICK':
      case 'BCHABC':
      case 'BSV':
      case 'S4F':
      case 'TRS':
      case 'VNT':
      case 'AED':
      case 'RUB':
      case 'CNY':
      case 'EUR':
      case 'CTX':
      case 'IDR':
      case 'LiqPay':
      case 'Privat24':
      case 'Invoice':
      case 'NGN':
      case 'Interkassa':
      case 'TRY':
      case 'UAH':
      case 'VND':
        name = 'no_icon';
        break;
    }
    const iconSrc = `assets/img/currency-icons/${name.toLowerCase()}.svg`;
    return iconSrc;
  }
}
