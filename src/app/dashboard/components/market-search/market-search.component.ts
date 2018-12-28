import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, AfterViewInit} from '@angular/core';

import {CurrencyPair} from '../../../model/currency-pair.model';
import {MarketService} from '../markets/market.service';
import {ChangeCurrencyPairAction} from '../../actions/dashboard.actions';
import {Store} from '@ngrx/store';
import {State} from '../../../core/reducers';

@Component({
  selector: 'app-market-search',
  templateUrl: 'market-search.component.html',
  styleUrls: ['market-search.component.scss']
})
export class MarketSearchComponent implements OnInit, AfterViewInit {

  @Input() pairs: CurrencyPair[];
  @Input() isFiat: boolean;
  public showPairs: CurrencyPair[];

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('input') input: ElementRef;

  constructor(
    private marketService: MarketService,
    private store: Store<State>,
  ) { }

  ngOnInit() {
    this.showPairs = [...this.pairs || []];
  }
  ngAfterViewInit() {
    this.input.nativeElement.focus();
  }

  splitPairName(name: string): string[] {
    return name.split('/');
  }

  onSearch(event) {
    this.showPairs = this.pairs.filter(f => f.currencyPairName.toUpperCase().match(event.toUpperCase()));
  }

  onCloseModal() {
    this.closeModal.emit(true);
  }

  setCurrentPair(pair: CurrencyPair) {
    this.store.dispatch(new ChangeCurrencyPairAction(pair));
    this.onCloseModal();
  }

  isFavorite(pair: CurrencyPair): boolean {
    return pair.isFavourite;
  }
}
