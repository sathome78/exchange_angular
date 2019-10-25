import { Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CurrencyBalanceModel } from 'app/model';

@Component({
  selector: 'app-currency-select-fiat',
  templateUrl: './currency-select-fiat.component.html',
  styleUrls: ['./currency-select-fiat.component.scss'],
})
export class CurrencySelectFiatComponent implements OnInit {
  @Input() public activeCurrency: CurrencyBalanceModel;
  @Input() public currencies: CurrencyBalanceModel[];
  @Output() public selectCurrency: EventEmitter<CurrencyBalanceModel> = new EventEmitter();
  @Output() public toggleDropdown: EventEmitter<boolean> = new EventEmitter();
  public openCurrencyDropdown = false;
  public alphabet;

  @HostListener('document:click', ['$event.target']) clickout(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.openCurrencyDropdown = false;
    }
  }

  constructor(private _elementRef: ElementRef) { }

  ngOnInit() { }

  toggleCurrencyDropdown() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.toggleDropdown.emit(this.openCurrencyDropdown);
  }

  closeDropdown() {
    this.openCurrencyDropdown = false;
    this.toggleDropdown.emit(this.openCurrencyDropdown);
  }

  onSelectCurrency(currency: CurrencyBalanceModel) {
    this.selectCurrency.emit(currency);
    this.toggleCurrencyDropdown();
  }



}
