import { Pipe, PipeTransform } from '@angular/core';
import { interval, of, Subject, forkJoin, timer, Scheduler, merge } from 'rxjs';
import { map, takeUntil, race, mergeMap } from 'rxjs/operators';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'timeLeftFreeCoins',
})
export class TimeLeftFreeCoinsPipe implements PipeTransform {
  private timerSub: Subject<string> = new Subject<string>();
  public available = this.translateService.instant('Available');

  constructor(private translateService: TranslateService) {}

  transform(lastRecieved: string, timeRange: number) {
    const timerSubPrivate: Subject<string> = new Subject<string>();
    if (!lastRecieved || !timeRange) {
      return of(this.available);
    }
    const end = moment.utc(lastRecieved).add(timeRange, 'minutes');
    const start = moment.utc();
    let diff = end.diff(start, 'seconds');

    if (diff > 86400) {
      return merge(
        of((() => {
          const days = Math.floor(diff / 86400);
          if (days > 0) {
            return `${days} ${days > 1 ? 'days' : 'day'} ${moment().startOf('day')
              .seconds(diff)
              .format('HH:mm:ss')}`;
          }
          return moment().startOf('day')
            .seconds(diff)
            .format('HH:mm:ss');
        })()),
        interval(1000)
          .pipe(takeUntil(this.timerSub))
          .pipe(takeUntil(timerSubPrivate))
          .pipe(map(() => {
            diff -= 1;
            const days = Math.floor(diff / 86400);
            if (diff < -1) {
              timerSubPrivate.next();
              timerSubPrivate.complete();
            }
            if (diff < 0) {
              return this.available;
            }
            if (days) {
              return `${days} ${days > 1 ? 'days' : 'day'} ${moment().startOf('day')
                .seconds(diff)
                .format('HH:mm:ss')}`;
            }
            return moment().startOf('day')
              .seconds(diff)
              .format('HH:mm:ss');
          }))
      );
    }

    if (diff > 0) {
      return merge(
        of(moment().startOf('day').seconds(diff).format('HH:mm:ss')),
        interval(1000)
          .pipe(takeUntil(this.timerSub))
          .pipe(takeUntil(timerSubPrivate))
          .pipe(map(() => {
            diff -= 1;
            if (diff < -1) {
              timerSubPrivate.next();
              timerSubPrivate.complete();
            }
            if (diff < 0) {
              return this.available;
            }
            return moment().startOf('day')
              .seconds(diff)
              .format('HH:mm:ss');
          }))
      );
    }
    return of(this.available);
  }

  stopTimer() {
    this.timerSub.next();
    this.timerSub.complete();
  }
}
