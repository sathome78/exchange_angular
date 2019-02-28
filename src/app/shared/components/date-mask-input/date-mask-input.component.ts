import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {IMyDateModel} from 'mydatepicker';
import * as moment from 'moment';

export const CUSTOM_INPUT_DATE_MASK_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR ,
  useExisting: forwardRef(() => DateMaskInputComponent),
  multi: true
};

@Component({
  selector: 'app-date-mask-input',
  templateUrl: './date-mask-input.component.html',
  styleUrls: ['./date-mask-input.component.scss'],
  providers: [CUSTOM_INPUT_DATE_MASK_ACCESSOR]
})
export class DateMaskInputComponent implements ControlValueAccessor, AfterViewInit, OnChanges {

  private _innerValue: any;
  private el: any;
  @Input('innValue') innValue: any;
  @Input('setOnInput') setOnInput = false;
  @Input('disableAutoFocus') disableAutoFocus: boolean = false;
  @ViewChild('inputEl') inputEl: ElementRef;
  @Output('customInputMask') customInputMask: EventEmitter<any>;
  @Output('validDate') validDate: EventEmitter<IMyDateModel>;
  @Output('inputFocus') inputFocus: EventEmitter<boolean>;
  private onTouched: Function;

  private validDatePattern = /\d{2}.\d{2}.\d{4}$/;

  constructor() {
    this.validDate = new EventEmitter<IMyDateModel>();
    this.customInputMask = new EventEmitter<any>();
    this.inputFocus = new EventEmitter<boolean>();
  }

  ngAfterViewInit() {
    this.el = this.inputEl.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('innValue')) {
      const value = !this.innValue ? null : this.innValue.date;
      if (value) {
        this.writeValue(`${this.addZeroIfNeed(value.day.toString())}.${this.addZeroIfNeed(value.month.toString())}.${value.year}`);
      } else {
        this.writeValue('');
        if(!this.disableAutoFocus) {
          this.el ? this.el.focus() : null;
        }
      }
    }
  }

  private addZeroIfNeed(value: string) {
    return value.toString().length === 1 ? '0' + value : value;
  }

  get value() {
    return this._innerValue;
  }

  set value(v) {
    this._innerValue = v;
  }

  inputData({target}) {
    if (new RegExp(this.validDatePattern).test(target.value)) {
      const currDate = new Date();

      const value = (new Date).getTime() > moment(target.value, ['DD.MM.YYYY']).unix()
        ? target.value
        : `${currDate.getDate()}.${currDate.getMonth() + 1}.${currDate.getFullYear()}`;
      const arrDate = value.split('.');
      const date = {
        date: {day: +arrDate[0], month: +arrDate[1], year: +arrDate[2]},
        epoc: (new Date(value)).getTime(),
        formatted: value,
        jsdate: new Date(value)
      };
      this.validDate.emit(date);
    }
    if (this.setOnInput) {
      this.writeValue(target.value);
    }
  }

  writeValue(value: any) {
    if (value == 'N/A') {
      return this._innerValue = value;
    }
    this._innerValue = value;
    this.propagateChanges(this._innerValue);
  }

  propagateChanges = (...any) => {
  }

  registerOnChange(fn: any): void {
    this.propagateChanges = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  onBlur($event) {
    this.onTouched();
    this.inputFocus.emit(false);
    this.writeValue($event.target.value);
  }

  onFocus($event) {
    this.inputFocus.emit(true);
  }
}
