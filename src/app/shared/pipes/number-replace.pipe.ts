import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'replaceNumber'
})
export class ReplaceNumberPipe implements PipeTransform {

  transform(value: number | string ): string {
    return value.toString().replace(',', ' ');
  }
}
