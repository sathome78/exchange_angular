import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-create-fug',
  templateUrl: './create-fug.component.html',
  styleUrls: ['./create-fug.component.scss']
})
export class CreateFugComponent implements OnInit {
  
  @Input() qubera;
  @Input() step;

  constructor() { }

  ngOnInit() {
    this.step = 1;
  }

  setStep(step: number) {
    this.step = step;
  }
  
  onCloseSendMoneyPopup() {
    console.log('hi');
  }

}
