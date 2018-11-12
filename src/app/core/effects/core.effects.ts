import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {Actions, Effect} from '@ngrx/effects';
import 'rxjs/add/operator/map';

import * as core from '../actions/core.actions';
import {CookieHelper} from '../../auth/helpers/cookie.helper';
import {LocaleInfo} from '../models/locale-info';

@Injectable()
export class CoreEffects {

  /**
   * Saves user location data to cookies
   */
  @Effect()
  setCookie$: Observable<Action> = this.actions$.ofType(core.SAVE_TO_COOKIE)
    .map(action => this.actionHelper(action));

  /**
   * Helps to handle
   */
  actionHelper(action): Action {
    const newCookie = this.mergeCookie(action.payload);
    this.setCookie(newCookie);
    return new core.SaveCompleteAction(newCookie);
  };

  /**
   * Helps to save data to cookie
   * @param data
   */
  setCookie(data): void {
    const cookie = JSON.stringify(data);
    CookieHelper.setCookie('y-locale', cookie);
  }

  /**
   * Gets cookie and merge with locale info
   */
  mergeCookie(locale: LocaleInfo): LocaleInfo {
    const cookie = CookieHelper.getCookie('y-locale');
    try {
      if (cookie) {
        const localeInfo = new LocaleInfo(JSON.parse(cookie))
        return {...localeInfo, ...locale}
      }
      return {...locale}
    } catch (e) {
      return {...locale};
    }
  }

  /**
   * Default constructor
   * @param actions$§
   */
  constructor(private actions$: Actions) {
  }
}
