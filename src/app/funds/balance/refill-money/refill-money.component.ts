import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-refill-money',
  templateUrl: './refill-money.component.html',
  styleUrls: ['./refill-money.component.scss']
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
    this.initFields();
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
