import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {getLanguage, State} from '../core/reducers';


@Component({
  selector: 'app-funds',
  templateUrl: './funds.component.html',
  styleUrls: ['./funds.component.scss']
})
export class FundsComponent implements OnInit {

  lang$: Observable<string>;

  constructor(
    private readonly translate: TranslateService,
    private store: Store<State>,
  ) {
    this.translate.setDefaultLang('en');
    this.lang$ = this.store.pipe(select(getLanguage));
  }

  ngOnInit() {
    // this.lang$.subscribe(lang => this.translate.use(lang));
  }

}
