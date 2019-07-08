import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {

  constructor() { }

  form: FormGroup;

  ngOnInit() {
    this.initForm();
  }


  initForm() {
    this.form = new FormGroup({
      country: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      birthDay: new FormControl(''),
      phone: new FormControl(''),
    })
  }

  gotToStepTwo(form: any) {
    if(form.valid) {
      console.log(form);
    }
  }


}
