import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store, select } from '@ngrx/store';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/internal/operators';
import { of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { SettingsService } from '../../settings.service';
import * as settingsActions from '../actions/settings.actions';
import * as fromCore from '../../../core/reducers';
import { UserService } from 'app/shared/services/user.service';
import * as fundsActions from '../../../funds/store/actions/funds.actions';
import { MyBalanceItem } from '../../../model/my-balance-item.model';
import { ApiKeysService } from '../../api-keys/api-keys.service';
import { ApiKeyItem } from '../../../model/api-key.model';

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
    private apiKeysService: ApiKeysService
  ) {}

  /**
   * Load session time
   */
  @Effect()
  loadSessionTime$: Observable<Action> = this.actions$
    .pipe(ofType<settingsActions.LoadSessionTimeAction>(settingsActions.LOAD_SESSION_TIME))
    .pipe(
      switchMap(action => {
        return this.settingsService.getSessionInterval().pipe(
          map(time => new settingsActions.SetSessionTimeAction(time.data)),
          catchError(error => of(new settingsActions.FailLoadSessionTimeAction(error)))
        );
      })
    );
  /**
   * Load session history
   */
  @Effect()
  loadSessionHistory$: Observable<Action> = this.actions$
    .pipe(ofType<settingsActions.LoadSessionHistoryAction>(settingsActions.LOAD_SESSION_HISTORY))
    .pipe(
      switchMap(action => {
        return this.settingsService.getSessionHistory().pipe(
          map(data => new settingsActions.SetSessionHistoryAction(data)),
          catchError(error => of(new settingsActions.FailLoadSessionHistoryAction(error)))
        );
      })
    );

  /**
   * Load api keys
   */
  @Effect()
  loadApiKeys$: Observable<Action> = this.actions$
    .pipe(ofType<settingsActions.LoadApiKeysAction>(settingsActions.LOAD_API_KEYS))
    .pipe(
      switchMap(() => {
        return this.apiKeysService.getApiKeys().pipe(
          map((res: ApiKeyItem[]) => new settingsActions.SetApiKeysAction(res)),
          catchError(error => of(new settingsActions.FailLoadApiKeysAction(error)))
        );
      })
    );
}
