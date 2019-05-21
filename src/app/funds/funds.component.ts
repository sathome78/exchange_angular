import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subject} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {getLanguage, State} from '../core/reducers';
import {takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-funds',
  templateUrl: './funds.component.html',
  styleUrls: ['./funds.component.scss']
})
export class FundsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  lang$: Observable<string>;

  constructor(
    private readonly translate: TranslateService,
    private store: Store<State>,
  ) {
    this.translate.setDefaultLang('en');
    this.lang$ = this.store.pipe(select(getLanguage));
  }

  ngOnInit() {
    // uncomment when the translation is ready
    this.lang$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(lang => this.translate.use(lang));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
