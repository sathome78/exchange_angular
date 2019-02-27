import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'showTransactionsStatus'
})
export class ShowTransactionsStatusPipe  implements PipeTransform {
  transform(status: string, sourceType: string): string {
    if(sourceType === 'WITHDRAW') {
      switch (status) {
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
    } else if(sourceType === 'USER_TRANSFER') {
      switch (status) {
        case 'POSTED':
          return 'Completed';
        case 'REVOKED':
          return 'Canceled';
        case 'REVOKED_ADMIN':
          return 'Declined';
        default:
          return status;
      }
    } else if(sourceType === 'REFILL') {
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
    } else {
      return status;
    }
  }
}
