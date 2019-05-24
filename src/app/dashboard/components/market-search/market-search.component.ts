import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { CurrencyPair } from '../../../model/currency-pair.model';
import { MarketService } from '../../services/market.service';
import * as dashboardActions from '../../actions/dashboard.actions';
import { Store } from '@ngrx/store';
import { State } from '../../../core/reducers';
import { UtilsService } from 'app/shared/services/utils.service';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-market-search',
  templateUrl: 'market-search.component.html',
  styleUrls: ['market-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketSearchComponent implements OnInit, AfterViewInit {

  @Input() pairs: CurrencyPair[];
  @Input() currency: string;
  @Input('isAuthenticated') public isAuthenticated: boolean = false;
  public showPairs: CurrencyPair[];
  public scrollHeight: number = 0;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('input') input: ElementRef;
  @ViewChild('container') container: ElementRef;

  constructor(
    private utils: UtilsService,
    private store: Store<State>,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.showPairs = [...this.pairs || []];
  }
  ngAfterViewInit() {
    this.input.nativeElement.focus();
    setTimeout(() => {
      this.scrollHeight = this.container.nativeElement.offsetHeight - 109;
      this.cdr.detectChanges();
    },         0);
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
    this.store.dispatch(
      new dashboardActions.ChangeActiveCurrencyPairAction({ name: pair.currencyPairName, id: pair.currencyPairId }),
    );
    this.utils.saveActiveCurrencyPairToSS({ name: pair.currencyPairName, id: pair.currencyPairId });
    this.toMobileWidget('trading');
    this.onCloseModal();
  }
  // refactor
  isFavorite(pair: CurrencyPair): boolean {
    return pair.isFavorite;
  }

  toMobileWidget(widgetName: string) {
    this.dashboardService.activeMobileWidget.next(widgetName);
  }

  // isFiat(pair: string): boolean {
  //   return this.utils.isFiat(currName);
  // }
}
