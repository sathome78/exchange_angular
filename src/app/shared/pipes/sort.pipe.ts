import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe  implements PipeTransform {
  transform(array: any[], field: string): any[] {
    return array.sort((a: any, b: any) => a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0);
  }
}
