import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/internal/operators';
import * as dashboardActions from '../actions/dashboard.actions';
import { of } from 'rxjs';

@Injectable()
export class DashboardEffects {

  /**
   * Default constructor
   *
   * @param actions$
   */
  constructor(
    private actions$: Actions,
  ) { }

}
