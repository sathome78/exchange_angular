import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'showStageStatus'
})
export class ShowStageStatusPipe  implements PipeTransform {
  transform(status: string, forStyle: boolean = false): string {
    switch (status) {
      case 'PENDING':
        return 'Upcoming'
      case 'RUNNING':
        return forStyle ? 'fast-sale' : 'Fast Sale';
      case 'TERMINATED':
        return 'Ended';
      case 'SUCCEEDED':
        return 'Success';
      case 'FAILED':
        return 'Failed';
      default:
        return status;
    }
  }
}
