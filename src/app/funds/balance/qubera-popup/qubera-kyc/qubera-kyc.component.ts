import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-qubera-kyc',
  templateUrl: 'qubera-kyc.component.html',
  styleUrls: ['qubera-kyc.component.scss']
})
export class QuberaKycComponent implements OnInit {

  @Input() qubera;
  @Input() steper;
  @Output() closeQuberaKycPopup = new EventEmitter<boolean>();
  @Output() getKYCStatus = new EventEmitter<boolean>();
  step: number;

  constructor() { }

  ngOnInit() {
    this.setStep(this.steper);
  }

  setStep(steper: number) {
    this.step = steper;
  }

  onCloseQuberaKycPopup() {
    setTimeout(() => {
      this.closeQuberaKycPopup.emit(true);
    }, 1000);
  }

  getStatusKYC() {
    this.getKYCStatus.emit(true);
  }

  nextStep(step: number) {
    this.step = step;
  }
}
