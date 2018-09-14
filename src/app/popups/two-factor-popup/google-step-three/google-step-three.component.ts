import { Component, OnInit } from '@angular/core';
import {OnNextStep, PopupService} from '../../../services/popup.service';

@Component({
  selector: 'app-google-step-three',
  templateUrl: './google-step-three.component.html',
  styleUrls: ['./google-step-three.component.scss']
})
export class GoogleStepThreeComponent implements OnInit, OnNextStep {

  constructor(private popupService: PopupService) { }

  ngOnInit() {
  }

  onNextStep() {
    this.popupService.moveNextStep();
  }

}
