import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { Animations } from 'app/shared/animations';
import { GAFreeCoinsModel } from '../models/GAFreeCoins.model';

@Component({
  selector: 'app-freecoins-popup',
  templateUrl: './freecoins-popup.component.html',
  styleUrls: ['./freecoins-popup.component.scss'],
  animations: [Animations.popupOverlayTrigger, Animations.popupModalTrigger],
})
export class FreecoinsPopupComponent implements OnInit {

  @Output() closeFreeCoinsPopup = new EventEmitter<boolean>();
  @Input() showPopup;
  public stepTwoName: string;
  public step = 1;
  public formData: GAFreeCoinsModel;

  showStepThree = false;

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.classList.contains('overlay--modal')) {
      this.onCloseFreeCoinsPopup();
    }
  }

  constructor() {}

  ngOnInit() {

  }

  setStep(step: number) {
    this.step = step;
  }

  onCloseFreeCoinsPopup() {
    this.showPopup = false;
    setTimeout(() => {
      this.closeFreeCoinsPopup.emit(true);
    }, 1000);
  }

  chooseRefil(name: string) {
    this.step = 2;
    this.stepTwoName = name;
  }

  changeSteps() {
    this.showStepThree = true;
  }

  hideStep() {
    this.showStepThree = false;
  }

  goNextStep(step) {
    this.step = step;
  }

  submitStep1(data: GAFreeCoinsModel) {
    this.formData = data;
    this.goNextStep(2);
  }
}
