import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {Actions, Effect} from '@ngrx/effects';
import {map} from "rxjs/internal/operators";

import * as core from '../actions/core.actions';

@Injectable()
export class CoreEffects {
/*
  /!**
   * Saves user's auth token to localStorage
   *!/
  @Effect({dispatch: false})
  setToken: Observable<void> = this.actions$.ofType(core.SAVE_TOKEN)
    .pipe(map(action => localStorage.setItem('TOKEN', action.payload)));*/


  /**
   * Default constructor
   * @param actions$§
   */
  constructor(private actions$: Actions) {
  }
}
