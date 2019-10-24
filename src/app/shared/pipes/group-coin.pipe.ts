import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupCoin',
})
export class GroupCoinPipe implements PipeTransform {
  transform(array: any[], field: string, key: string = 'name'): any[] {
    const result = [];
    array.forEach(item => {
      if (item[key][0].toLowerCase() === field.toLowerCase()) {
        result.push(item);
      }
    });
    return result;
  }
}
