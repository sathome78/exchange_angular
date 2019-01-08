import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {select, Store} from '@ngrx/store';
import {getLanguage, State} from '../core/reducers';
import {Observable} from 'rxjs';

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
              private store: Store<State>) {
    this.translate.setDefaultLang('en');
    this.lang$ = this.store.pipe(select(getLanguage));
    // const path = authService.isAuthenticated() ? '/settings/two-factor-auth' : '/';
    // this.router.navigate(['/settings/two-factor-auth']);
  }

  ngOnInit() {
    // this.lang$.subscribe(lang => this.translate.use(lang));
  }

}
