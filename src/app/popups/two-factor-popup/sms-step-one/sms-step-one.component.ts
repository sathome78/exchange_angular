import { Component, OnInit } from '@angular/core';
import {OnNextStep, PopupService} from '../../../services/popup.service';

@Component({
  selector: 'app-sms-step-one',
  templateUrl: './sms-step-one.component.html',
  styleUrls: ['./sms-step-one.component.scss']
})
export class SmsStepOneComponent implements OnInit, OnNextStep {

  constructor(private popupService: PopupService){ }

  ngOnInit() {
  }

  onNextStep() {
    this.popupService.moveNextStep();
  }

}
