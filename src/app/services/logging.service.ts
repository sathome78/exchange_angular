import {Injectable} from '@angular/core';

@Injectable()
export class LoggingService {

  private LEVEL_DEBUG = 1;
  private LEVEL_INFO = 2;
  private LEVEL_ERROR = 3;

  private isLoggingEnabled = true;
  private loggerLevel = this.LEVEL_DEBUG;

  error(clazz: Object, message: string) {
    if (this.isLoggingEnabled && this.loggerLevel <= this.LEVEL_ERROR) {
      console.log(clazz.constructor.name + 'ERROR ==> ' + message);
    }
  }

  info(clazz: Object, message: string) {
    if (this.isLoggingEnabled && this.loggerLevel <= this.LEVEL_INFO) {
      console.log(clazz.constructor.name + ': INFO ==> ' + message);
    }
  }

  debug(clazz: Object, message: string) {
    if (this.isLoggingEnabled && this.loggerLevel <= this.LEVEL_DEBUG) {
      console.log(clazz.constructor.name + ': DEBUG ==> ' + message);
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // months are zero indexed
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const hourFormatted = hour % 12 || 12; // hour returned in 24 hour format
    const minuteFormatted = minute < 10 ? '0' + minute : minute;

    return day + '.' + month + '.' + year + ' ' + hourFormatted + '.' + minuteFormatted + '.' + second;
  }
}
