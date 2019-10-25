import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import * as _uniq from 'lodash/uniq';
import { SyndexPSCurrency } from 'app/funds/models/syndex-payment-system.model';

@Component({
  selector: 'app-syndex-payment-currencies-selector',
  templateUrl: './syndex-payment-currencies-selector.component.html',
  styleUrls: ['./syndex-payment-currencies-selector.component.scss']
})
export class SyndexPaymentCurrenciesSelectorComponent implements OnInit {
  @Input() public activePSCurrency: SyndexPSCurrency;
  @Input() public currencies: SyndexPSCurrency[];
  @Output() public select: EventEmitter<SyndexPSCurrency> = new EventEmitter();
  public filteredList: SyndexPSCurrency[];
  public openDropdown = false;
  public alphabet: string[];

  @HostListener('document:click', ['$event.target']) public clickout(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.openDropdown = false;
    }
  }

  constructor(private _elementRef: ElementRef) { }

  ngOnInit() {
    this.filteredList = this.currencies;
    this.prepareAlphabet();
  }

  dropdownToggle() {
    this.openDropdown = !this.openDropdown;
    if (this.openDropdown) {
      this.filteredList = this.currencies;
      this.prepareAlphabet();
    }
  }

  prepareAlphabet() {
    const temp = [];
    this.filteredList.forEach(item => {
      const letter = item.iso.toUpperCase()[0];
      temp.push(letter);
    });
    const unique = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    this.alphabet = _uniq(temp.filter(unique).sort());
  }

  onSelect(currency: SyndexPSCurrency) {
    this.select.emit(currency);
    this.dropdownToggle();
  }

  search(e) {
    this.filteredList = this.currencies.filter(f => f.iso.toUpperCase().match(e.target.value.toUpperCase()));
    this.prepareAlphabet();
  }

  trackByAlphabet(index, item) {
    return item;
  }

  trackBy(index, item) {
    return item.name;
  }

}
