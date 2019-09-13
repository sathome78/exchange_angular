import { Pipe, PipeTransform } from '@angular/core';
import { of, timer, BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

@Pipe({
  name: 'disableGetCoin',
})
export class DisableGetFreeCoinsPipe implements PipeTransform {

  transform(lastRecieved: string, timeRange: number) {
    if (!lastRecieved || !timeRange) {
      return of(false);
    }
    const end = moment.utc(lastRecieved).add(timeRange, 'minutes');
    const start = moment.utc();
    const diff = end.diff(start, 'seconds');
    const subject = new BehaviorSubject(true);
    if (diff > 0) {
      timer(diff * 1000).subscribe(() => {
        subject.next(false);
      });
      return subject;
    }
    return of(false);
  }
}
