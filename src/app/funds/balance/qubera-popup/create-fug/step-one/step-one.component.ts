import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {

  constructor() { }

  form: FormGroup;
  @Output() public nextStep: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.initForm();
  }


  initForm() {
    this.form = new FormGroup({
      country: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      birthDay: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      theCheckbox: new FormControl('', Validators.required)
    });
    this.form.controls.theCheckbox.setValue(false);
  }

  gotToStepTwo(form: any) {
    // if(form.valid && this.theCheckbox === true) {
      console.log(form);
      this.nextStep.emit(2);
    // }
  }

  checked(e) {
    console.log(e.target.checked);
    // this.theCheckbox = e.target.checked;
    this.form.controls.theCheckbox.setValue(e.target.checked);
  }


}
