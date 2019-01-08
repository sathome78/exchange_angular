import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {select, Store} from '@ngrx/store';
import {getLanguage, State} from '../core/reducers';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

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
