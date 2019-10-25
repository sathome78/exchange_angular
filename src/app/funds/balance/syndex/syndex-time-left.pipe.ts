import { Pipe, PipeTransform } from '@angular/core';
import { interval, of, Subject, forkJoin, timer, Scheduler, merge } from 'rxjs';
import { map, takeUntil, race, mergeMap } from 'rxjs/operators';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'timeLeftSyndex',
})
export class TimeLeftSyndexPipe implements PipeTransform {
  private timerSub: Subject<string> = new Subject<string>();

  constructor(private translateService: TranslateService) {}

  transform(lastModified: string) {
    const timerSubPrivate: Subject<string> = new Subject<string>();
    if (!lastModified) {
      return of('00:00');
    }
    const end = moment.utc(lastModified).add(90, 'minutes');
    const start = moment.utc();
    let diff = end.diff(start, 'seconds');

    if (diff > 0) {
      return merge(
        of(moment().startOf('day').seconds(diff).format('mm:ss')),
        interval(1000)
          .pipe(takeUntil(this.timerSub))
          .pipe(takeUntil(timerSubPrivate))
          .pipe(map(() => {
            diff -= 1;
            if (diff < -1) {
              timerSubPrivate.next();
              timerSubPrivate.complete();
            }
            if (diff <= 0) {
              return '00:00';
            }
            return moment().startOf('day')
              .seconds(diff)
              .format('mm:ss');
          }))
      );
    }
    return of('00:00');
  }

  stopTimer() {
    this.timerSub.next();
    this.timerSub.complete();
  }
}
