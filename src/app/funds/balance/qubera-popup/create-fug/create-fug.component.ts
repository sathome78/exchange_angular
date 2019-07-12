import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-create-fug',
  templateUrl: './create-fug.component.html',
  styleUrls: ['./create-fug.component.scss']
})
export class CreateFugComponent implements OnInit {
  
  @Input() qubera;
  @Input() steper;
  @Input() email;
  @Output() closeSendQuberaPopup = new EventEmitter<boolean>()
  step: number;

  constructor() { }

  ngOnInit() {
    this.setStep(this.steper);
  }

  setStep(steper: number) {
    this.step = steper;
  }

  onCloseSendMoneyPopup() {
    setTimeout(() => {
      console.log('hi 1');
      this.closeSendQuberaPopup.emit(true);
    }, 1000);
  }

  
  nextStep(numb) {
    this.step = numb;
  }

}
