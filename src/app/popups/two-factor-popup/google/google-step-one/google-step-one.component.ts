import { Component, OnInit } from '@angular/core';
import {OnNextStep, PopupService} from '../../../../services/popup.service';


@Component({
  selector: 'app-google-step-one',
  templateUrl: './google-step-one.component.html',
  styleUrls: ['./google-step-one.component.scss']
})
export class GoogleStepOneComponent implements OnInit, OnNextStep {

  constructor(private popupService: PopupService) { }

  ngOnInit() {

  }

  onNextStep() {
    this.popupService.moveNextStep();
  }

}
