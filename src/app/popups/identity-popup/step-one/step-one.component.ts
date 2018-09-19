import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IMyDpOptions, IMyDateModel} from 'mydatepicker';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {

  @Output() onNextStep = new EventEmitter<number>();
  form: FormGroup;

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
    // height: '45px'
  };
  public model: any = { date: { year: 2018, month: 10, day: 9 } };

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      'firstName': new FormControl('', {validators: [Validators.required]}),
      'lastName': new FormControl('', {validators: [Validators.required]}),
      'born': new FormControl(null, {validators: [Validators.required]}),
      'address': new FormControl('', {validators: [Validators.required]}),
      'postalCode': new FormControl('', {validators: [Validators.required]}),
      'country': new FormControl('', {validators: [Validators.required]}),
      'city': new FormControl('', {validators: [Validators.required]}),
    });
  }

  moveNext() {
    this.onNextStep.emit(2);
  }

  onSubmit() {
    this.moveNext();
  }

  setDate(): void {
    // Set today date using the patchValue function
    const date = new Date();
    this.form.patchValue({'born': {
        date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()}
      }});
  }

  clearDate(): void {
    // Clear the date using the patchValue function
    this.form.patchValue({'born': null});
  }
}
