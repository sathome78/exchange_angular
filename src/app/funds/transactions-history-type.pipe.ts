import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'showTransactionsType'
})
export class ShowTransactionsTypePipe  implements PipeTransform {
  transform(sourceType: string): string {

    switch (sourceType) {
      case 'WITHDRAW':
        return 'Withdraw';
      case 'USER_TRANSFER':
        return 'Transfer / Voucher / Voucher free'
      case 'REFILL':
        return 'Deposit';
      default:
        return sourceType;
    }
  }
}
