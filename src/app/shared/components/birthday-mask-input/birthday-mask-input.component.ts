import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  SimpleChanges,
  AfterViewInit,
  OnChanges,
  forwardRef
} from '@angular/core';
import { IMyDateModel } from 'mydatepicker';
import * as moment from 'moment';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const CUSTOM_INPUT_BIRTHDAY_MASK_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => BirthdayMaskInputComponent),
  multi: true,
};

@Component({
  selector: 'app-birthday-mask-input',
  templateUrl: './birthday-mask-input.component.html',
  styleUrls: ['./birthday-mask-input.component.scss'],
  providers: [CUSTOM_INPUT_BIRTHDAY_MASK_ACCESSOR],
})
export class BirthdayMaskInputComponent implements ControlValueAccessor, AfterViewInit, OnChanges {
  private _innerValue: any;
  private el: any;
  @Input() innValue: any;
  @Input() limitDate = true;
  @Input() setOnInput = false;
  @Input() disableAutoFocus = false;
  @ViewChild('inputEl') inputEl: ElementRef;
  @Output() customInputMask: EventEmitter<any>;
  @Output() validDate: EventEmitter<IMyDateModel>;
  @Output() inputFocus: EventEmitter<boolean>;
  @Output() inputEmpty: EventEmitter<boolean>;

  private validDatePattern = /\d{2}.\d{2}.\d{4}$/;
  private onTouched: any = () => {};

  constructor() {
    this.validDate = new EventEmitter<IMyDateModel>();
    this.customInputMask = new EventEmitter<any>();
    this.inputFocus = new EventEmitter<boolean>();
    this.inputEmpty = new EventEmitter<boolean>();
  }

  ngAfterViewInit() {
    this.el = this.inputEl.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('innValue')) {
      const value = !this.innValue ? null : this.innValue.date;
      if (value) {
        this.writeValue(
          `${this.addZeroIfNeed(value.day.toString())}.${this.addZeroIfNeed(value.month.toString())}.${value.year}`
        );
      } else {
        this.writeValue('');
        if (!this.disableAutoFocus && this.el) {
          this.el.focus();
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

  inputData({ target }) {
    if (new RegExp(this.validDatePattern).test(target.value)) {
      const today = `${moment().date()}.${moment().month() + 1}.${moment().year() - 18}`;
      let value = target.value;
      if (this.limitDate) {
        value =
          moment().unix() < moment(target.value, ['DD.MM.YYYY']).unix()
            ? today
            : moment(target.value, ['DD.MM.YYYY']).unix() < moment('01.01.1929', ['DD.MM.YYYY']).unix()
            ? today
            : target.value;
      }
      const arrDate = value.split('.');
      const date = {
        date: { day: +arrDate[0], month: +arrDate[1], year: +arrDate[2] },
        epoc: new Date(value).getTime(),
        formatted: value,
        jsdate: new Date(value),
      };
      this.validDate.emit(date);
    }
    if (this.setOnInput) { this.writeValue(target.value); }
    if (target.value === '') { this.inputEmpty.emit(true); }
  }

  writeValue(value: any) {
    if (value === 'N/A') {
      return (this._innerValue = value);
    }
    this._innerValue = value;
    this.propagateChanges(this._innerValue);
  }

  propagateChanges = (...any) => {};

  registerOnChange(fn: any): void {
    this.propagateChanges = fn;
  }

  registerOnTouched(fn): void {
    this.onTouched = fn;
  }

  onBlur(event) {
    this.onTouched();
    if (!this.el.value) { this.inputFocus.emit(false); }
    this.writeValue(event.target.value);
  }

  onFocus($event) {
    this.inputFocus.emit(true);
  }
}
