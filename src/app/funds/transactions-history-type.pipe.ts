import {Pipe, PipeTransform} from '@angular/core';
import {TransactionHistoryItem} from './models/transactions-history-item.model';

@Pipe({
  name: 'showTransactionsType'
})
export class ShowTransactionsTypePipe  implements PipeTransform {
  transform(sourceType: string, item: TransactionHistoryItem = null): string {

    switch (sourceType) {
      case 'WITHDRAW':
        return 'Withdraw';
      case 'USER_TRANSFER':
        return this.getUserTransferName(item);
      case 'REFILL':
        return 'Deposit';
      case 'TRANSFER':
        return 'Transfer';
      case 'IEO':
        return 'IEO';
      default:
        return sourceType;
    }
  }

  getUserTransferName(item: TransactionHistoryItem): string {
    if (!!item && item.merchantName) {
      switch (item.merchantName) {
        case 'SimpleTransfer':
          return 'Transfer';
        case 'VoucherFreeTransfer':
          return 'Voucher'
        case 'VoucherTransfer':
          return 'Voucher free';
        default:
          return item.merchantName;
      }
    }
    return '';
  }
}
