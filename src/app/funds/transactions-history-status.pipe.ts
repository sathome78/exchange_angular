import { Pipe, PipeTransform } from '@angular/core';
import { TransactionHistoryItem } from './models/transactions-history-item.model';

@Pipe({
  name: 'showTransactionsStatus',
})
export class ShowTransactionsStatusPipe implements PipeTransform {
  transform(status: string, item: TransactionHistoryItem): string {
    if (item.sourceType === 'WITHDRAW') {
      switch (status) {
        case 'ON_BCH_EXAM':
          return 'On pending';
        case 'REVOKED_USER':
          return 'Canceled';
        case 'DECLINED_ADMIN':
        case 'DECLINED_ERROR':
          return 'Declined';
        case 'POSTED_MANUAL':
        case 'POSTED_AUTO':
          return 'Completed';
        default:
          return status;
      }
    }
    if (item.sourceType === 'USER_TRANSFER') {
      switch (status) {
        case 'POSTED':
          return 'Completed';
        case 'POSTPONED_AS_VOUCHER':
          return 'Awaits deposit';
        case 'REVOKED':
          return 'Canceled';
        case 'REVOKED_ADMIN':
          return 'Declined';
        case 'REVOKED_USER':
          return 'Canceled';
        default:
          return status;
      }
    }
    if (item.sourceType === 'REFILL') {
      switch (status) {
        case 'DECLINED_ADMIN':
          return 'Declined';
        case 'ACCEPTED_AUTO':
        case 'ACCEPTED_ADMIN':
          return 'Completed';
        case 'REVOKED_USER':
          return 'Canceled';
        case 'EXPIRED':
          return 'Expired';
        default:
          return status;
      }
    }
    if (item.sourceType === 'IEO') {
      switch (status) {
        case 'PROCESSED_BY_CLAIM':
          return 'Completed';
        case 'REVOKED_BY_IEO_FAILURE':
          return 'IEO Revoked';
        default:
          return status;
      }
    }
    if (item.sourceType === 'FREE_COINS_TRANSFER') {
      switch (status) {
        case 'CREATED_BY_USER':
        case 'CREATED':
          return 'Completed';
        default:
          return status;
      }
    }
    return status;
  }
}
