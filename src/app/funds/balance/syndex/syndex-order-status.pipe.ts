import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'syndexOrderStatus',
})
export class SyndexOrderStatusPipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case 'COMPLETE':
        return 'Completed';
      case 'MODERATION':
        return 'On moderation';
      default:
        return status;
    }
  }
}
