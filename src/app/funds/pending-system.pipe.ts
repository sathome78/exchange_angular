import {Pipe, PipeTransform} from '@angular/core';
import {UtilsService} from 'app/shared/services/utils.service';

@Pipe({
  name: 'showPendingSystem'
})
export class ShowPendingSystemPipe  implements PipeTransform {
  constructor(
    private utils: UtilsService,
  ) {}
  transform(system: string, currencyName: string): string {
    return this.utils.isFiat(currencyName) ? system : '-';
  }
}

