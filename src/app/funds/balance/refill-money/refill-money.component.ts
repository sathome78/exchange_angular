import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Animations } from 'app/shared/animations';

@Component({
  selector: 'app-refill-money',
  templateUrl: './refill-money.component.html',
  styleUrls: ['./refill-money.component.scss'],
  animations: [Animations.popupOverlayTrigger, Animations.popupModalTrigger],
})
export class RefillMoneyComponent implements OnInit {
  @Output() closeRefillBalancePopup = new EventEmitter<boolean>();
  @Input() optionData;
  @Input() showPopup;
  public stepTwoName: string;
  public step: number;

  showStepThree: boolean = false;

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.classList.contains('overlay--modal')) {
      this.onCloseRefillBalancePopup();
    }
  }

  constructor() {}

  ngOnInit() {
    this.initFields();
  }

  setStep(step: number) {
    this.step = step;
  }

  onCloseRefillBalancePopup() {
    this.initFields();
    this.showPopup = false;
    setTimeout(() => {
      this.closeRefillBalancePopup.emit(true);
    }, 1000);
  }

  chooseRefil(name: string) {
    this.step = 2;
    this.stepTwoName = name;
  }

  private initFields() {
    this.step = this.optionData.step ? this.optionData.step : 1;
    this.stepTwoName = this.optionData.stepName ? this.optionData.stepName : '';
  }

  changeSteps() {
    this.showStepThree = true;
  }

  hideStep() {
    console.log('hi');
    this.showStepThree = false;
  }
}
