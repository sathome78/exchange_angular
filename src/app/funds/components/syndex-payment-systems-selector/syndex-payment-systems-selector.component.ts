import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import * as _uniq from 'lodash/uniq';
import { SyndexPaymentSystem } from 'app/funds/models/syndexPaymentSystem.model';

@Component({
  selector: 'app-syndex-payment-systems-selector',
  templateUrl: './syndex-payment-systems-selector.component.html',
  styleUrls: ['./syndex-payment-systems-selector.component.scss'],
})
export class SyndexPaymentSystemsSelectorComponent implements OnInit {

  @Input() public activePS: SyndexPaymentSystem;
  @Input() public paymentSystems: SyndexPaymentSystem[];
  @Output() public select: EventEmitter<SyndexPaymentSystem> = new EventEmitter();
  public filteredList: SyndexPaymentSystem[];
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
    this.filteredList = this.paymentSystems;
    // this.prepareAlphabet();
  }

  dropdownToggle() {
    this.openDropdown = !this.openDropdown;
    if (this.openDropdown) {
      this.filteredList = this.paymentSystems;
      // this.prepareAlphabet();
    }
  }

  // prepareAlphabet() {
  //   const temp = [];
  //   this.filteredList.forEach(country => {
  //     const letter = country.name.toUpperCase()[0];
  //     temp.push(letter);
  //   });
  //   const unique = (value, index, self) => {
  //     return self.indexOf(value) === index;
  //   };
  //   this.alphabet = _uniq(temp.filter(unique).sort());
  // }

  onSelect(currency: SyndexPaymentSystem) {
    this.select.emit(currency);
    this.dropdownToggle();
  }

  search(e) {
    this.filteredList = this.paymentSystems.filter(f => f.name.toUpperCase().match(e.target.value.toUpperCase()));
    // this.prepareAlphabet();
  }

  trackByAlphabet(index, item) {
    return item;
  }

  trackBy(index, item) {
    return item.name;
  }

}
