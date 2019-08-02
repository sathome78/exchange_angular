import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent implements OnInit {
  @Input() qubera;
  @Input() steper;
  @Output() closeSendMoneyPopup = new EventEmitter<boolean>();
  step: number;

  form: FormGroup;

  constructor() {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      code: new FormControl('', Validators.required),
    });
  }

  setStep(steper) {
    this.step = steper;
  }

  enterCode(form) {}

  get currentCode(): any {
    return this.form.get('code');
  }

  onCloseSendMoneyPopup() {
    setTimeout(() => {
      this.closeSendMoneyPopup.emit(true);
    }, 1000);
  }
}
