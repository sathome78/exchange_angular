import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-step-one-withdraw',
  templateUrl: './step-one-withdraw.component.html',
  styleUrls: ['./step-one-withdraw.component.scss']
})
export class StepOneWithdrawComponent implements OnInit {
  form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.initForm();
  }


  initForm() {
    this.form = new FormGroup({
      firstName: new FormControl(''),
      lastname: new FormControl(''),
      bankaddress: new FormControl(''),
      bankcountrycode: new FormControl(''),
      bankname: new FormControl(''),
      swift: new FormControl(''),
      ibal: new FormControl(''),
      city: new FormControl(''),
      countryCode: new FormControl(''),
      zipCode: new FormControl(''),
      amount: new FormControl('')
    })
  }

}
