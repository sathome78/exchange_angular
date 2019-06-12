import {Component, forwardRef, Input, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {UtilsService} from '../../services/utils.service';
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
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class PriceInputComponent implements ControlValueAccessor, AfterViewInit {
  private _innerValue: any;
  private el: any;
  @Input() public placeholder: any;
  @Input() public currencyLabel = '';
  @Input() public forTrading = false;
  @Input() public currencyName = '';
  @ViewChild('inputEl') inputEl: ElementRef;
  @Output() customInput: EventEmitter<any>;
  @Output() customBlur: EventEmitter<boolean>;
  private patternInput = /^\d+\.(\.\d+)*$|^\d+(\.\d+)*$/;
  private onTouched: Function;
  private thousands_separator: string;

  constructor(
    private utils: UtilsService
  ) {
    this.onTouched = () => {};
    this.customInput = new EventEmitter<any>();
    this.customBlur = new EventEmitter<boolean>();
    this.thousands_separator = ' ';
  }

  ngAfterViewInit() {
    this.el = this.inputEl.nativeElement;
    this.el.value = this.priceFormat(this.el.value, this.currencyName);
  }

  onInput(e) {
    let value = this.utils.deleteSpace(e.target.value);
    value = this.excludeDoubleZero(value);
    if (this.patternInput.test(value)) {
      this.inputEl.nativeElement.value = this.currencyFormat(e, value);
    } else {
      value === '' ? this.customInput.emit(e) : null;
      this.inputEl.nativeElement.value = value.replace(e.data, '');
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
      return value[0] === '0' && value[1] !== '.' ? value.slice(1) : value;
    } else {
      return value;
    }
  }

  get value() {
    return this._innerValue;
  }

  set value(v) {
    this._innerValue = v;
  }

  writeValue(value: any) {
    if (value === 'N/A') {
      return this._innerValue = value;
    }
    this._innerValue = this.priceFormat(value, this.currencyName);
    this.propagateChanges(parseFloat(value));
  }

  propagateChanges = (...any) => {
  }

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
    if ($event.target.value === '') {
      this.inputEl.nativeElement.value = '0';
    }
    this.customBlur.emit(true);
  }


  priceFormat(value: string, currencyName: string = ''): string | number {
    const num = value;
    if (num) {
      if (this.utils.isFiat(currencyName)) {
        return this.sliceFraction(num, 2);
      }
      return this.sliceFraction(num, 8);
    } else {
      return '';
    }
  }

  sliceFraction(value: string, count: number): string {
    const index = value.toString().indexOf('.');
    if (index >= 0) {
      const temp = value.substr(0, index + 1 + count);
      return this.thousandsFormat(temp, true);
    }
    return this.thousandsFormat(value);
  }

  private thousandsFormat(value: string, hasFraction = false): string {
    if (hasFraction) {
      const parts = value.split('.');
      const integer = this.addThousandsSpace(parts[0]);
      return `${integer}.${parts[1]}`;
    } else {
      return this.addThousandsSpace(value);
    }
  }

  addThousandsSpace(decimal: string): string {
    decimal = this.utils.deleteSpace(decimal);
    let i = decimal.length % 3;
    const parts = i ? [decimal.substr(0, i)] : [];
    for (; i < decimal.length; i += 3) {
      parts.push(decimal.substr(i, 3));
    }
    return parts.join(' ');
  }

}
