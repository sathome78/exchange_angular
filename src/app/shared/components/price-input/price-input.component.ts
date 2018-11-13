import {Component, forwardRef, Input, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {CurrencyPipe} from '../../pipes/currency.pipe';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PriceInputComponent),
  multi: true
};

@Component({
  selector: 'app-price-input',
  templateUrl: './price-input.component.html',
  styleUrls: ['./price-input.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, CurrencyPipe]
})
export class PriceInputComponent implements ControlValueAccessor, AfterViewInit {
  private _innerValue: any;
  private el: any;
  @Input('placeholder') public placeholder: any;
  @ViewChild('inputEl') inputEl: ElementRef;
  @Output('customInput') customInput: EventEmitter<any>

  constructor(private currencyUsdPipe: CurrencyPipe) {
    this.customInput = new EventEmitter<any>();
  }

  ngAfterViewInit() {
    this.el = this.inputEl.nativeElement;
    this.el.value = this.currencyUsdPipe.transform(this.el.value);
  }

  onInput(e) {
    this.customInput.emit(e);
  }

  get value() {
    return this._innerValue
  }

  set value(v) {
    this._innerValue = v;
  }

  writeValue(value: any) {
    if (value == 'N/A')
      return this._innerValue = value;
    this._innerValue = this.currencyUsdPipe.transform(value);
    this.propagateChanges(this.currencyUsdPipe.parse(this._innerValue));
  }

  propagateChanges = (...any) => {
  };

  registerOnChange(fn: any): void {
    this.propagateChanges = fn;
  }

  registerOnTouched(fn: any) {
  }

  onFocus() {
    this.el.select();
  }

  onBlur($event) {
    this.writeValue($event.target.value);
  }

}
