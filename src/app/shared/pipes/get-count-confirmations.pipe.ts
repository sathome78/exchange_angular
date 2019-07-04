import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'countConfirmations'
})
export class GetCountConfirmationsPipe  implements PipeTransform {
  transform(value: number, currencyName: string): number {
    switch (currencyName) {
      case 'ADK':
       return value === 0 ? 0 : 1;
      default:
        return value;
    }
  }
}

