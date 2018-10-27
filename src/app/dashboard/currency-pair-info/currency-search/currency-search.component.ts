import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import * as _chain from 'lodash/chain';
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
  defaultCurrencies;
  /** close currency search bar */
  @Output() closeCurrencySearch = new EventEmitter();
  /** emit selected currency */
  @Output() selectCurrency = new EventEmitter<string>();

  _groupedCurrencies: Currency[];
  public alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  constructor() { }

  ngOnInit() {
    this.defaultCurrencies = [...this.currencies];
  }

  /**
   * Close currency search bar
   */
  onClose(): void {
    this.closeCurrencySearch.emit();
  }

  searchCoin(e) {
    this.currencies = this.defaultCurrencies.filter(f => f.name.toUpperCase().match(e.target.value.toUpperCase()));
    const temp = [];
    this.currencies.forEach(order => temp.push(order.name[0]));

    const unique = (value, index, self) => {
      return self.indexOf(value) === index;
    }
    this.alphabet = temp.filter(unique);
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
