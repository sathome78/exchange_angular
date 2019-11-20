import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyBalanceModel } from 'app/model';
import * as _uniq from 'lodash/uniq';
import { CurrencyChoose } from 'app/model/currency-choose.model';

@Component({
  selector: 'app-currency-select-crypto',
  templateUrl: './currency-select-crypto.component.html',
  styleUrls: ['./currency-select-crypto.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencySelectCryptoComponent implements OnInit {
  @Input() public activeCurrency: CurrencyChoose ;
  @Input() public currencies: CurrencyChoose[];
  @Output() public selectCurrency: EventEmitter<CurrencyChoose> = new EventEmitter();
  public filteredList: CurrencyChoose[];
  public openCurrencyDropdown = false;
  public alphabet: string[];

  @HostListener('document:click', ['$event.target']) public clickout(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.openCurrencyDropdown = false;
    }
  }

  constructor(private _elementRef: ElementRef) { }

  ngOnInit() {
    this.filteredList = this.currencies;
    this.prepareAlphabet();
  }

  currencyDropdownToggle() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    if (this.openCurrencyDropdown) {
      this.filteredList = this.currencies;
      this.prepareAlphabet();
    }
  }

  prepareAlphabet() {
    const temp = [];
    this.filteredList.forEach(currency => {
      const letter = currency.name.toUpperCase()[0];
      temp.push(letter);
    });
    const unique = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    this.alphabet = _uniq(temp.filter(unique).sort());
  }

  onSelectCurrency(currency: CurrencyBalanceModel) {
    this.selectCurrency.emit(currency);
    this.currencyDropdownToggle();
  }

  searchCoin(e) {
    this.filteredList = this.currencies.filter(f => f.name.toUpperCase().match(e.target.value.toUpperCase()));
    this.prepareAlphabet();
  }

  trackByAlphabet(index, item) {
    return item;
  }

  trackByCurrencies(index, item) {
    return item.name;
  }

}
