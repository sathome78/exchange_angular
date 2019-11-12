import {
  Component,
  OnInit,
  forwardRef,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { UtilsService } from '../../services/utils.service';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NewPriceInputComponent),
  multi: true,
};

@Component({
  selector: 'app-new-price-input',
  templateUrl: './new-price-input.component.html',
  styleUrls: ['./new-price-input.component.scss'],
})
export class NewPriceInputComponent implements OnInit {
  private _innerValue: any = 0;
  private onTouched: Function;
  private onChange: Function;

  constructor() { }

  ngOnInit() {
  }

  get value() {
    return this._innerValue;
  }

  set value(v) {
    this._innerValue = v;
    if (this.propagateChanges) {
      this.propagateChanges(v);
    }
  }

  propagateChanges = (...any) => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

}
