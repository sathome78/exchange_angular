import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-create-qubera',
  templateUrl: 'create-qubera.component.html',
  styleUrls: ['create-qubera.component.scss']
})
export class CreateQuberaComponent implements OnInit {

  @Input() qubera;
  @Input() steper;
  @Output() closeQuberaPopup = new EventEmitter<boolean>();
  @Output() getKYCStatus = new EventEmitter<boolean>();
  step: number;

  constructor(
  ) { }

  ngOnInit() {
    this.step = 1;
  }

  setStep(steper) {
    this.step = steper;
  }

  nextStep(step: number) {
    this.step = step;
  }

  onCloseQuberaPopup() {
    setTimeout(() => {
      this.getKYCStatus.emit(true);
      this.closeQuberaPopup.emit(true);
    }, 1000);
  }

}
