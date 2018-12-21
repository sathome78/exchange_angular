import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-refill-money',
  templateUrl: './refill-money.component.html',
  styleUrls: ['./refill-money.component.scss'],
  animations: [
    trigger('overlayAnimation', [
      // ...
      state('show', style({
        backgroundColor: 'rgba(0, 0, 0, 0.85)'
      })),
      state('hide', style({
        backgroundColor: 'transparent'
      })),
      transition(':enter', [
        animate('0s linear')
      ]),
      transition(':leave', [
        animate('0.2s linear')
      ]),
    ]),
    trigger('modalAnimation', [
      // ...
      state('show', style({
        right: 0
      })),
      state('hide', style({
        right: '-900px'
      })),
      transition(':enter', [
        animate('0.4s linear')
      ]),
      transition(':leave', [
        animate('0.4s linear')
      ]),
    ]),
  ],
})
export class RefillMoneyComponent implements OnInit {

  @Output() closeRefillBalancePopup = new EventEmitter<boolean>();
  @Input() optionData;
  @Input() showPopup;
  public stepTwoName: string;
  public step: number;

  constructor() {
  }

  ngOnInit() {
    this.initFields();
  }

  setStep(step: number) {
    this.step = step;
  }

  onCloseRefillBalancePopup() {
    this.closeRefillBalancePopup.emit(true);
  }

  chooseRefil(name: string) {
    this.step = 2;
    this.stepTwoName = name;
  }

  private initFields() {
    this.step = this.optionData.step ? this.optionData.step : 1;
    this.stepTwoName = this.optionData.stepName ? this.optionData.stepName : '';
  }

}
