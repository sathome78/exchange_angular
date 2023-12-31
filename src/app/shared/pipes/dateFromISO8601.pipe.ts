import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateFromISO8601'
})
export class DateFromISO8601Pipe  implements PipeTransform {
  transform(value) {
    return moment({
      y: value.year,
      M: value.monthValue - 1,
      d: value.dayOfMonth,
      h: value.hour,
      m: value.minute,
      s: value.second});
  }
}
