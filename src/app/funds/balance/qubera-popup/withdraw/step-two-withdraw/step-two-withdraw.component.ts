import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-step-two-withdraw',
  templateUrl: './step-two-withdraw.component.html',
  styleUrls: ['./step-two-withdraw.component.scss']
})
export class StepTwoWithdrawComponent implements OnInit {

  form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      code: new FormControl('', Validators.required)
    });
  }

  enterCode(form) {
    console.log(form);
  }


}
