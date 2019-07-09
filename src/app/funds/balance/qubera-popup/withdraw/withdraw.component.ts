import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent implements OnInit {
  @Input() qubera;
  @Input() steper;
  step: number;

  constructor() { }

  ngOnInit() {
    this.setStep(this.steper);
  }

  onCloseSendMoneyPopup() {
    console.log(' hi');
  }

  setStep(obj: number) {
    this.step = obj;
  }

  nextStep(numb) {
    console.log('hi mf');
    this.step = numb;
  }

}
