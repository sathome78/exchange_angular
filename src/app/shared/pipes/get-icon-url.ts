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
      case 'TAO':
      case 'WaBi':
      case 'ECT':
      case 'ENGT':
      case 'QUICK':
      case 'TRS':
      case 'VNT':
      case 'LiqPay':
      case 'Invoice':
      case 'Interkassa':
      case 'Mir Payment':
      case 'Alfaclick Payment':
      case 'VRBS':
      case 'RBC':
      case 'uDOOOO':
        name = 'no_icon';
        break;
    }

    const iconSrc = `assets/img/currency-icons/${name.toLowerCase()}${isWhite && this.utilService.isFiat(name) ? '-white' : ''}.svg`;
    return iconSrc;
  }
}
