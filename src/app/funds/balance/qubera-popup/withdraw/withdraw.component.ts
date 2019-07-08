import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent implements OnInit {
  @Input() qubera;
  @Input() step;

  constructor() { }

  ngOnInit() {
  }

  onCloseSendMoneyPopup() {
    console.log(' hi');
  }

  setStep(obj: any) {
    console.log(' hi');
  }

}
