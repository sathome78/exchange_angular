import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { SyndexCountry } from 'app/funds/models/syndexCountry.model';
import * as _uniq from 'lodash/uniq';

@Component({
  selector: 'app-syndex-countries-selector',
  templateUrl: './syndex-countries-selector.component.html',
  styleUrls: ['./syndex-countries-selector.component.scss'],
})
export class SyndexCountriesSelectorComponent implements OnInit {

  @Input() public activeCountry: SyndexCountry;
  @Input() public countries: SyndexCountry[];
  @Output() public select: EventEmitter<SyndexCountry> = new EventEmitter();
  public filteredList: SyndexCountry[];
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
    this.filteredList = this.countries;
    this.prepareAlphabet();
  }

  dropdownToggle() {
    this.openDropdown = !this.openDropdown;
    if (this.openDropdown) {
      this.filteredList = this.countries;
      this.prepareAlphabet();
    }
  }

  prepareAlphabet() {
    const temp = [];
    this.filteredList.forEach(country => {
      const letter = country.name.toUpperCase()[0];
      temp.push(letter);
    });
    const unique = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    this.alphabet = _uniq(temp.filter(unique).sort());
  }

  onSelect(currency: SyndexCountry) {
    this.select.emit(currency);
    this.dropdownToggle();
  }

  search(e) {
    this.filteredList = this.countries.filter(f => f.name.toUpperCase().match(e.target.value.toUpperCase()));
    this.prepareAlphabet();
  }

  trackByAlphabet(index, item) {
    return item;
  }

  trackBy(index, item) {
    return item.name;
  }

}
