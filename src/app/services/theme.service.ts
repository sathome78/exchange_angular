import {Injectable} from '@angular/core';
import {LoggingService} from './logging.service';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Injectable()
export class ThemeService {

  constructor(private logger: LoggingService) {}

  private isDarkTheme = false;

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;

    if (this.isDarkTheme) {
      this.logger.debug(this, 'Current theme is set to dark');
    } else {
      this.logger.debug(this, 'Current theme is set to light');
    }
  }

  setDarkTheme() {
    this.isDarkTheme = true;
    this.logger.debug(this, 'Current theme is set to dark');
  }

  setLightTheme() {
    this.isDarkTheme = false;
    this.logger.debug(this, 'Current theme is set to light');
  }

  isCurrentThemeDark(): boolean {
    return this.isDarkTheme;
  }

  public getColorScheme(): string {
    return this.isDarkTheme ? 'DARK' : 'LIGHT';
  }
}
