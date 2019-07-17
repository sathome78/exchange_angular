import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-create-currency',
  templateUrl: './create-currency.component.html',
  styleUrls: ['./create-currency.component.scss']
})
export class CreateCurrencyComponent implements OnInit {

  @Input() qubera;
  @Input() steper;
  @Output() closeSendQuberaPopup = new EventEmitter<boolean>();
  step: number;


  constructor(
  ) { }

  ngOnInit() {
    this.step = 1;
  }

  setStep(steper) {
    this.step = steper;
  }

  
  nextStep(numb) {
    this.step = numb;
  }

  onCloseSendMoneyPopup() {
    setTimeout(() => {
      this.closeSendQuberaPopup.emit(true);
    }, 1000);
  }

}
