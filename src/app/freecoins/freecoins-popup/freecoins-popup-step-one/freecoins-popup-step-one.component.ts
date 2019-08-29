import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-freecoins-popup-step-one',
  templateUrl: './freecoins-popup-step-one.component.html',
  styleUrls: ['./freecoins-popup-step-one.component.scss'],
})
export class FreecoinsPopupStepOneComponent implements OnInit {
  @Output() nextStep = new EventEmitter<boolean>();
  public form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      amount: new FormControl('', [Validators.required]),
    });
  }

  selectCurrency(currency) {

  }

}
