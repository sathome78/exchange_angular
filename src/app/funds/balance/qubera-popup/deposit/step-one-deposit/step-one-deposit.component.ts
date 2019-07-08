import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-step-one-deposit',
  templateUrl: './step-one-deposit.component.html',
  styleUrls: ['./step-one-deposit.component.scss']
})
export class StepOneDepositComponent implements OnInit {

  constructor() { }

  form: FormGroup;

  ngOnInit() {
    this.initForm()
  }


  initForm() {
    this.form = new FormGroup({
      amount: new FormControl('')
    });
  }


}
