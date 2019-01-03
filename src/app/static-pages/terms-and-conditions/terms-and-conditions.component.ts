import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {select, Store} from '@ngrx/store';
import {getLanguage, State} from '../../core/reducers';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {

  lang$: Observable<string>;

  constructor(
    private readonly translate: TranslateService,
    private store: Store<State>,
  ) {
    this.translate.setDefaultLang('en');
    this.lang$ = this.store.pipe(select(getLanguage));
  }

  ngOnInit() {
    this.lang$.subscribe(lang => this.translate.use(lang));
  }

}
