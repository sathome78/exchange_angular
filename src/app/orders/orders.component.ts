import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';
import { getLanguage, State } from '../core/reducers';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  lang$: Observable<string>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private readonly translate: TranslateService, private store: Store<State>) {
    this.translate.setDefaultLang('en');
    this.lang$ = this.store.pipe(select(getLanguage));
  }

  ngOnInit() {
    // uncomment when the translation is ready
    this.lang$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(lang => this.translate.use(lang));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
