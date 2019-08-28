import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-freecoins-popup-step-one',
  templateUrl: './freecoins-popup-step-one.component.html',
  styleUrls: ['./freecoins-popup-step-one.component.scss']
})
export class FreecoinsPopupStepOneComponent implements OnInit {
  @Output() nextStep = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

}
