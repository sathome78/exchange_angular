import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-freecoins-popup-step-two',
  templateUrl: './freecoins-popup-step-two.component.html',
  styleUrls: ['./freecoins-popup-step-two.component.scss']
})
export class FreecoinsPopupStepTwoComponent implements OnInit {
  @Output() nextStep = new EventEmitter<boolean>();


  constructor() { }

  ngOnInit() {
  }

}
