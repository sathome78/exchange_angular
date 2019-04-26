import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {select, Store} from '@ngrx/store';
import * as fromCore from '../core/reducers';
import {Observable} from 'rxjs';
import * as settingsActions from './store/actions/settings.actions'
import * as coreAction from '../core/actions/core.actions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  // host: {'class': 'app-settings'}
})
export class SettingsComponent implements OnInit {

  lang$: Observable<string>;

  constructor(private router: Router,
              private authService: AuthService,
              private readonly translate: TranslateService,
              private store: Store<fromCore.State>) {
    this.translate.setDefaultLang('en');
    this.lang$ = this.store.pipe(select(fromCore.getLanguage));
  }

  ngOnInit() {
    this.lang$.subscribe(lang => this.translate.use(lang));
    this.store.dispatch(new settingsActions.LoadGAStatusAction());
    this.store.dispatch(new settingsActions.LoadSessionTimeAction());
  }

}
