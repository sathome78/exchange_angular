import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'positivePipe'})
export class PositivePipe implements PipeTransform {

  transform(value: number): any {
    if (value < 0) {
      value = Math.abs(value);
    }
    return value;
  }

}
