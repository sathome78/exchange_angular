import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transferNamePipe',
})
export class TransferNamePipe implements PipeTransform {
  transform(name: string): string {
    switch (name) {
      case 'SimpleTransfer':
        return 'Instant transfer';
      case 'VoucherTransfer':
        return 'Protected by code & mail';
      case 'VoucherFreeTransfer':
        return 'Protected by code only';
      default:
        return name;
    }
  }

}
