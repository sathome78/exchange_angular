import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'showStageStatus'
})
export class ShowStageStatusPipe  implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Upcoming'
      case 'RUNNING':
        return 'Fast Sale';
      case 'SUCCEEDED':
        return 'Succeeded';
      case 'FAILED':
        return 'Failed';
      default:
        return status;
    }
  }
}

