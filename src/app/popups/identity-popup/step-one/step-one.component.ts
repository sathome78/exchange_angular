import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {

  @Output() onNextStep = new EventEmitter<number>();
  form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      'firstName': new FormControl('', {validators: [Validators.required]}),
      'lastName': new FormControl('', {validators: [Validators.required]}),
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

}
