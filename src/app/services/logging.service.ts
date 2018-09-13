import {Injectable} from '@angular/core';

@Injectable()
export class LoggingService {

  private LEVEL_DEBUG = 1;
  private LEVEL_INFO = 2;
  private LEVEL_ERROR = 3;

  private isLoggingEnabled = true;
  private loggerLevel = this.LEVEL_INFO;

  error(clazz: Object, message: string) {
    if (this.isLoggingEnabled && this.loggerLevel > this.LEVEL_INFO) {
      console.log(clazz.constructor.name + 'ERROR ==> ' + message);
    }
  }

  info(clazz: Object, message: string) {
    if (this.isLoggingEnabled && this.loggerLevel > this.LEVEL_DEBUG) {
      console.log(clazz.constructor.name + ': INFO ==> ' + message);
    }
  }

  debug(clazz: Object, message: string) {
    if (this.isLoggingEnabled && this.loggerLevel > 0) {
      console.log(clazz.constructor.name + ': DEBUG ==> ' + message);
    }
  }
}
