import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'positivePipe' })
export class PositivePipe implements PipeTransform {
  transform(value: number): any {
    let newValue = value;
    if (value < 0) {
      newValue = Math.abs(value);
    }
    return newValue;
  }
}
