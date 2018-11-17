import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {Router, UrlTree} from '@angular/router';
import {Location} from '@angular/common';
import {Effect, Actions} from '@ngrx/effects';
import * as RouterActions from '../actions/router.actions';
import {URLSearchParams} from '@angular/http'
import {map, tap} from "rxjs/internal/operators";

const objectToQuery = (obj: Object) => {
  const params = new URLSearchParams();
  Object.keys(obj).forEach(key => params.set(key, obj[key]));

  return params.toString();
}

@Injectable()
export class RouterEffects {

  /**
   * Navigates to given path
   */
  @Effect({dispatch: false})
  navigate$ = this.actions$.ofType(RouterActions.GO)
    .pipe(
      map((action: RouterActions.GoAction) => action.payload),
      tap(({path, query: queryParams, extras}) => this.router.navigate(path, {queryParams, ...extras}))
    );

  /**
   * Navigates back
   */
  @Effect({dispatch: false})
  navigateBack$ = this.actions$.ofType(RouterActions.BACK)
    .pipe(tap(() => this.location.back()));

  /**
   * Navigates forward
   */
  @Effect({dispatch: false})
  navigateForward$ = this.actions$.ofType(RouterActions.FORWARD)
    .pipe(tap(() => this.location.forward()));

  /**
   * Replaces search query
   */
  @Effect({dispatch: false})
  navigateSearch$ = this.actions$.ofType(RouterActions.SEARCH)
    .pipe(tap((action: RouterActions.SearchAction) => {
      const urlTree: UrlTree = this.router.parseUrl(this.router.url);
      urlTree.queryParams = action.payload;
      this.router.navigateByUrl(urlTree);
    }));

  constructor(private actions$: Actions,
              private router: Router,
              private location: Location) {
  }
}
