import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';
import * as fromCore from '../core/reducers';
import { Observable, Subject } from 'rxjs';
import * as settingsActions from './store/actions/settings.actions';
import * as coreAction from '../core/actions/core.actions';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  lang$: Observable<string>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public startAnimation = false;
  public startAnimationTab = true;
  public activeLink = '';
  constructor(
    private router: Router,
    private authService: AuthService,
    private readonly translate: TranslateService,
    private store: Store<fromCore.State>
  ) {
    this.translate.setDefaultLang('en');
    this.lang$ = this.store.pipe(select(fromCore.getLanguage));
  }

  ngOnInit() {
    // uncomment when the translation is ready
    // this.lang$
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe(lang => this.translate.use(lang));

    setTimeout(() => {
      this.startAnimation = true;
    }, 300);
    this.store
      .pipe(select(fromCore.getUserInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userInfo: ParsedToken) => {
        if (userInfo) {
          this.store.dispatch(new coreAction.Load2faStatusAction(userInfo.username));
        }
      });
    this.store.dispatch(new settingsActions.LoadSessionTimeAction());
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  activeLnk(url) {
    this.startAnimationTab = false;
    setTimeout(() => {
      this.navTo(url);
    }, 0);
    setTimeout(() => {
      this.startAnimationTab = true;
    }, 600);
  }

  navTo(target) {
    this.router.navigate([target]);
  }

  isUrl(url) {
    return this.router.url === url;
  }

}
