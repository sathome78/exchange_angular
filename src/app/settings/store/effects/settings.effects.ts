import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {map, switchMap, catchError} from 'rxjs/internal/operators';
import {of} from 'rxjs';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {SettingsService} from '../../settings.service';
import * as settingsActions from '../actions/settings.actions';
import { UserService } from 'app/shared/services/user.service';

@Injectable()
export class SettingsEffects {

  /**
  * Default constructor
  *
  * @param actions$
  */
  constructor(
    private actions$: Actions,
    private settingsService: SettingsService,
    private userService: UserService,

  ) {
  }

  /**
   * Load GA status
   */
  @Effect()
  loadGAStatus$: Observable<Action> = this.actions$
    .pipe(ofType<settingsActions.LoadGAStatusAction>(settingsActions.LOAD_GA_STATUS))
    .pipe(switchMap((action) => {
      return this.userService.getUserGoogleLoginEnabled(action.payload)
        .pipe(
          map(status => new settingsActions.SetGAStatusAction(status)),
          catchError(error => of(new settingsActions.FailLoadGAStatusAction(error)))
        )
    }))

  /**
   * Load session time
   */
  @Effect()
  loadSessionTime$: Observable<Action> = this.actions$
    .pipe(ofType<settingsActions.LoadSessionTimeAction>(settingsActions.LOAD_SESSION_TIME))
    .pipe(switchMap((action) => {
      return this.settingsService.getSessionInterval()
        .pipe(
          map(time => new settingsActions.SetSessionTimeAction(time)),
          catchError(error => of(new settingsActions.FailLoadSessionTimeAction(error)))
        )
    }))

}
