import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../services/utils.service';

@Pipe({
  name: 'getIconUrl',
})
export class GetIconUrl implements PipeTransform {
  constructor(private utilService: UtilsService) {}

  transform(name: string, isWhite: boolean = false): string {
    switch (name) {
      case '':
      case 'DOR':
      case 'CMS_X':
      case 'EXR':
      case 'KOD':
      case 'TAO':
      case 'WaBi':
      case 'ECT':
      case 'ENGT':
      case 'QUICK':
      case 'TRS':
      case 'VNT':
      case 'RIME':
      case 'TCAT':
      case 'EXO':
      case 'HT':
      case 'LiqPay':
      case 'Invoice':
      case 'Interkassa':
      case 'Mir Payment':
      case 'Alfaclick Payment':
      // case 'Qubera':
      case 'DIM.EUR':
      case 'DIM.USD':
      case 'HNI':
      case 'MET':
      case 'PLTC':
      case 'PPY':
      case 'QKC':
      case 'RDN':
      case 'REN':
      case 'VRBS':
      case 'BSV':
      case 'RBC':
      case 'RVC':
      case 'TTT':
      case 'uDOOOO':
      case 'VRA':

      case 'ZUBE':
        name = 'no_icon';
        break;
    }

    const iconSrc = `assets/img/currency-icons/${name.toLowerCase()}${isWhite && this.utilService.isFiat(name) ? '-white' : ''}.svg`;
    return iconSrc;
  }
}
