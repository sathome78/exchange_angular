import {Component, forwardRef, Input, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {CurrencyPipe} from '../../pipes/currency.pipe';
import {UtilsService} from '../../services/utils.service';
import {RoundCurrencyPipe} from '../../pipes/round-currency.pipe';
import {el} from '@angular/platform-browser/testing/src/browser_util';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PriceInputComponent),
  multi: true
};

@Component({
  selector: 'app-price-input',
  templateUrl: './price-input.component.html',
  styleUrls: ['./price-input.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, CurrencyPipe, RoundCurrencyPipe]
})
export class PriceInputComponent implements ControlValueAccessor, AfterViewInit {
  private _innerValue: any;
  private el: any;
  @Input('placeholder') public placeholder: any;
  @Input('currencyLabel') public currencyLabel = '';
  @Input('forTrading') public forTrading = false;
  @Input('currencyName') public currencyName = '';
  @ViewChild('inputEl') inputEl: ElementRef;
  @Output('customInput') customInput: EventEmitter<any>
  private patternInput = /^\d+\.(\.\d+)*$|^\d+(\.\d+)*$/;
  private onTouched: Function;

  constructor(
    private currencyUsdPipe: CurrencyPipe,
    private roundCurrencyPipe: RoundCurrencyPipe,
    private utils: UtilsService
  ) {
    this.onTouched = () => {};
    this.customInput = new EventEmitter<any>();
  }

  ngAfterViewInit() {
    this.el = this.inputEl.nativeElement;
    this.el.value = this.currencyUsdPipe.transform(this.el.value);
  }

  onInput(e) {
    let value = this.utils.deleteSpace(e.target.value);
    value = this.excludeDoubleZero(value);
    if (this.patternInput.test(value)) {
      this.inputEl.nativeElement.value = this.currencyFormat(e, value);
    } else {
      value === '' ? this.customInput.emit(e) : null;
      this.inputEl.nativeElement.value = value.slice(0, -1);
    }
  }

  currencyFormat(e: Event, value: string): string {
    const count = this.utils.isFiat(this.currencyName) ? 2 : 8;
    const digitParts = value.split('.');
    if (digitParts[0] && digitParts[1] && digitParts[1].length > count) {
      const fraction = digitParts[1].slice(0, count);
      return `${digitParts[0]}.${fraction}`;
    } else {
      this.customInput.emit(e);
      return value;
    }
  }

  excludeDoubleZero(value) {
    if (value[0] && value[1]) {
      return value[0] === '0' && value[1] === '0' ? '0' : value;
    } else {
      return value;
    }
  }

  get value() {
    return this.exponentToNumber(this._innerValue);
  }

  set value(v) {
    this._innerValue = v;
  }

  writeValue(value: any) {
    if (value == 'N/A')
      return this._innerValue = value;
    value = value ? this.roundCurrencyPipe.transform(value, this.currencyName) : value;
    this._innerValue = this.currencyUsdPipe.transform(value);
    this.propagateChanges(this.currencyUsdPipe.parse(this._innerValue));
  }

  propagateChanges = (...any) => {
  };

  registerOnChange(fn: any): void {
    this.propagateChanges = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  onFocus() {
    this.el.select();
  }

  onBlur($event) {
    this.onTouched();
    this.writeValue($event.target.value);
  }

  /**
   * Method transform exponent format to number
   */
  exponentToNumber(exponentialNumber: number): number|string {
    const str = exponentialNumber.toString();
    if (str.indexOf('e') !== -1) {
      const exponent = parseInt(str.split('-')[1], 10);
      const result = parseFloat(exponentialNumber.toString()).toFixed(exponent);
      return result;
    } else {
      return exponentialNumber;
    }
  }
}
