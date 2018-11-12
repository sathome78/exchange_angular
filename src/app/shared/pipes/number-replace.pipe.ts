import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'replaceNumber'
})
export class ReplaceNumberPipe implements PipeTransform {



  transform(value: number | string ): string {
    if (value) {
      const replaceMask = ' ';
      const searchMask = ',';
      const regex = new RegExp(searchMask, 'ig');

      return value.toString().replace(regex, replaceMask);
    }
    return '';
  }
}
