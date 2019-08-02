import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'getDateString',
})
export class GetDateStringPipe implements PipeTransform {
  transform(time: string, format: string, returnFormat: string): string {
    const tempDate = moment(time, format);
    return tempDate.format(returnFormat);
  }
}
