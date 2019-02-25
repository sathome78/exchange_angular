import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'showOrderStatus'
})
export class ShowOrderStatusPipe  implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case 'CANCELLED':
        return 'Cancelled';
      case 'CLOSED':
        return 'Filled';
      default:
        return status;
    }
  }
}
