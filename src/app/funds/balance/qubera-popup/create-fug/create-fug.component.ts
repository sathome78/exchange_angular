import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-create-fug',
  templateUrl: './create-fug.component.html',
  styleUrls: ['./create-fug.component.scss']
})
export class CreateFugComponent implements OnInit {
  
  @Input() qubera;
  @Input() steper;
  step: number;

  constructor() { }

  ngOnInit() {
    this.setStep(this.steper);
  }

  setStep(steper: number) {
    this.step = steper;
  }
  
  onCloseSendMoneyPopup() {
    console.log('hi');
  }

  
  nextStep(numb) {
    console.log('hi mf');
    this.step = numb;
  }

}
