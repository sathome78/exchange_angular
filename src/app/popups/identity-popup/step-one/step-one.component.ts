import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IMyDpOptions, IMyDateModel} from 'mydatepicker';
import {UserVerificationModel} from '../../../settings/verification/user-verification.model';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {

  @Output() nextStep = new EventEmitter<number>();
  @Output() createVerificationEntity = new EventEmitter<UserVerificationModel>();
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
    this.nextStep.emit(2);
  }

  onSubmit() {
    this.moveNext();
  }
}
