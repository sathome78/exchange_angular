import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateWrapper'
})
export class DateWrapper implements PipeTransform {
  transform(value: string ): Date {
    return new Date(value.replace(/-/g, "/"));
  }

}
