import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showWidgetPipe',
})
export class ShowWidgetPipe  implements PipeTransform {
  transform(widgetName: string, isAuthenticated: boolean): boolean {
    if (!isAuthenticated) {
      switch (widgetName) {
        case 'trade-history':
        case 'orders':
          return false;
      }
    }
    return true;
  }
}
