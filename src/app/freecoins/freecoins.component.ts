import { Component, OnInit } from '@angular/core';
import * as coreAction from '../core/actions/core.actions';
import { Store } from '@ngrx/store';
import { State } from 'app/core/reducers';

@Component({
  selector: 'app-freecoins',
  templateUrl: './freecoins.component.html',
  styleUrls: ['./freecoins.component.scss'],
})
export class FreecoinsComponent implements OnInit {
  public showFreeCoinsPopup = false;

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.store.dispatch(new coreAction.LoadCryptoCurrenciesForChoose());
  }

  toggleFreeCoinsPopup(value) {
    this.showFreeCoinsPopup = value;
  }

}
