import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements OnInit {

  @Output() closeQuberaKycPopup = new EventEmitter<boolean>();
  @Output() getKYCStatus = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  getStatusKYC() {
    this.getKYCStatus.emit(true);
  }
}
