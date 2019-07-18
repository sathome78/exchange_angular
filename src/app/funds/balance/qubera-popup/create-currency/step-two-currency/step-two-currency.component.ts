import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-step-two-currency',
  templateUrl: './step-two-currency.component.html',
  styleUrls: ['./step-two-currency.component.scss']
})
export class StepTwoCurrencyComponent implements OnInit {

  
  @Output() closeSendQuberaPopup = new EventEmitter<boolean>();
  @Output() getKYCStatus = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

}
