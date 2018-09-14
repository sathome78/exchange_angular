import { Component, OnInit } from '@angular/core';
import {OnNextStep, PopupService} from '../../../services/popup.service';

@Component({
  selector: 'app-telegram-step-one',
  templateUrl: './telegram-step-one.component.html',
  styleUrls: ['./telegram-step-one.component.scss']
})
export class TelegramStepOneComponent implements OnInit, OnNextStep {

  constructor(private popupService: PopupService) { }

  ngOnInit() {
  }

  onNextStep() {
    this.popupService.moveNextStep();
  }

}
