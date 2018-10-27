import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'groupCoin'
})
export class GroupCoinPipe  implements PipeTransform {
  transform(array: any[], field: string): any[] {
    const result = [];
    array.forEach(item => {
       if (item.name[0].toLowerCase() === field.toLowerCase()) {
         result.push(item);
       }
    });
    return result;
  }
}
