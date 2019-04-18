import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Action, Store, select} from '@ngrx/store';
import {map, switchMap, catchError, withLatestFrom} from 'rxjs/internal/operators';
import {of} from 'rxjs';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {SettingsService} from '../../settings.service';
import * as settingsActions from '../actions/settings.actions';
import * as fromCore from '../../../core/reducers';
import { UserService } from 'app/shared/services/user.service';
import * as fundsActions from '../../../funds/store/actions/funds.actions';
import {MyBalanceItem} from '../../../model/my-balance-item.model';
import {ApiKeysService} from '../../api-keys/api-keys.service';

@Injectable()
export class SettingsEffects {

  /**
  * Default constructor
  *
  * @param actions$
  */
  constructor(
    private actions$: Actions,
    private store$: Store<fromCore.State>,
    private settingsService: SettingsService,
    private userService: UserService,
    private apiKeysService: ApiKeysService,

  ) {
  }

  /**
   * Load GA status
   */
  @Effect()
  loadGAStatus$: Observable<Action> = this.actions$
    .pipe(ofType<settingsActions.LoadGAStatusAction>(settingsActions.LOAD_GA_STATUS))
    .pipe(withLatestFrom(this.store$.pipe(select(fromCore.getUserInfo))))
    .pipe(switchMap(([action, userInfo]: [settingsActions.LoadGAStatusAction, ParsedToken]) => {
      return this.userService.getUserGoogleLoginEnabled(userInfo.username)
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
          map(time => new settingsActions.SetSessionTimeAction(time.data)),
          catchError(error => of(new settingsActions.FailLoadSessionTimeAction(error)))
        )
    }))

  /**
   * Load api keys
   */
  @Effect()
  loadApiKeys$: Observable<Action> = this.actions$
    .pipe(ofType<settingsActions.LoadApiKeysAction>(settingsActions.LOAD_API_KEYS))
    .pipe(switchMap(() => {
      return this.apiKeysService.getApiKeys()
        .pipe(
          map((res: any[]) => (new settingsActions.SetApiKeysAction(res))),
          catchError(error => of(new settingsActions.FailLoadApiKeysAction(error)))
        );
    }));

}
