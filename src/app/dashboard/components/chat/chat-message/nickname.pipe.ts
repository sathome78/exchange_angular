import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'nickname'
})
export class NicknamePipe implements PipeTransform {

  transform(value: string): any {
    return value.split('@')[0];
  }

}
