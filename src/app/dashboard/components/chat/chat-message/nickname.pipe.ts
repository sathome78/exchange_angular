import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'nickname'
})
export class NicknamePipe implements PipeTransform {

  transform(value: string): any {
    const words = value.split('@');
    return words[0];
  }

}
