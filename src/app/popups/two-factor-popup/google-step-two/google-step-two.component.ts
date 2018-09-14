import { Component, OnInit } from '@angular/core';
import {OnNextStep, PopupService} from '../../../services/popup.service';

@Component({
  selector: 'app-google-step-two',
  templateUrl: './google-step-two.component.html',
  styleUrls: ['./google-step-two.component.scss']
})
export class GoogleStepTwoComponent implements OnInit, OnNextStep {

  constructor(private popupService: PopupService) { }

  ngOnInit() {
  }

  onNextStep() {
    this.popupService.moveNextStep();
  }

}
