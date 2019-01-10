import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'excludeByField'
})
export class ExcludeByFieldPipe  implements PipeTransform {
  transform(array: any[], field: string, value: string): any[] {
    const arr = array.filter(item => item[field] !== value);
    return arr;
  }
}
