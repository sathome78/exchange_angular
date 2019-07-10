import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  @Input() qubera;
  @Input() steper;
  step: number;

  form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      code: new FormControl('', Validators.required)
    })
  }

  setStep(steper) {
    this.step = steper;
  }

  enterCode(form) {
    console.log(form);
  }

  
  get currentCode(): any {
    return this.form.get('code');
  }

}
