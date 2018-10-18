import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';

import {Currency} from './currency.model';

@Component({
  selector: 'app-currency-search',
  templateUrl: 'currency-search.component.html',
  styleUrls: ['currency-search.component.scss']
})
export class CurrencySearchComponent implements OnInit {
  /** currencies to be shown */
  @Input() set currencies(values: Currency[]) {
    // TODO
    // http://www.competa.com/blog/custom-groupby-pipe-angular-4/
    // we need to filter by group and by currency name (pipe or filter function in component)
    this._groupedCurrencies = values;
    /*values.forEach(value => {
      console.log(this._groupedCurrencies[value.name[0]])
    })*/
  };
  get currencies() {
    return this._groupedCurrencies;
  }
  /** close currency search bar */
  @Output() closeCurrencySearch = new EventEmitter();
  /** emit selected currency */
  @Output() selectCurrency = new EventEmitter<string>();

  _groupedCurrencies: Currency[];

  constructor() { }

  ngOnInit() {

  }

  /**
   * Close currency search bar
   */
  onClose(): void {
    this.closeCurrencySearch.emit();
  }

  /**
   * Choose currency
   *
   * @param ISO
   */
  onCurrencyClick(ISO: string): void {
    this.selectCurrency.emit(ISO);
    this.closeCurrencySearch.emit();
  }

}
