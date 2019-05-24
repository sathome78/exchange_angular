import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showPendingStatus',
})
export class ShowPendingStatusPipe  implements PipeTransform {
  transform(status: string, operationType: string): string {
    if (operationType === 'WITHDRAW') {
      switch (status) {
        case 'CREATED_USER':
        case 'WAITING_MANUAL_POSTING':
        case 'WAITING_AUTO_POSTING':
        case 'WAITING_CONFIRMATION':
        case 'IN_WORK_OF_ADMIN':
        case 'WAITING_CONFIRMED_POSTING':
        case 'IN_POSTING':
        case 'WAITING_REVIEWING':
        case 'TAKEN_FOR_WITHDRAW':
        case 'ON_BCH_EXAM':
          return 'Awaits output';
        default:
          return status;
      }
    }  if (operationType === 'REFILL') {
      switch (status) {
        case 'CREATED_USER':
          return 'Awaits deposit';
        case 'CREATED_BY_FACT':
        case 'WAITING_CONFIRMATION_USER':
        case 'ON_PENDING':
        case 'CONFIRMED_USER':
        case 'ON_BCH_EXAM':
        case 'IN_WORK_OF_ADMIN':
        case 'TAKEN_FROM_PENDING':
        case 'TAKEN_FROM_EXAM':
        case 'ON_INNER_TRANSFERRING':
        case 'WAITING_REVIEWING':
        case 'TAKEN_FOR_REFILL':
          return 'Awaits payment';
        default:
          return status;
      }
    }  if (operationType === 'TRANSFER') {
      switch (status) {
        case 'POSTPONED_AS_VOUCHER':
          return 'Awaits deposit';
        default:
          return status;
      }
    }
    return status;

  }
}
