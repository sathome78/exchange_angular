import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements OnInit {

  constructor() { }

  
  @Output() closeSendQuberaPopup = new EventEmitter<boolean>();
  @Output() getKYCStatus = new EventEmitter<boolean>();

  
  ngOnInit() {
  }
  getStatusKYC() {
    this.getKYCStatus.emit(true);
  }
}
