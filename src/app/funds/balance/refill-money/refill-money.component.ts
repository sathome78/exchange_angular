import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-refill-money',
  templateUrl: './refill-money.component.html',
  styleUrls: ['./refill-money.component.scss']
})
export class RefillMoneyComponent implements OnInit {

  @Output() closeRefillBalancePopup = new EventEmitter<boolean>();
  public stepTwoName: string;
  public step: number;

  constructor() { }

  ngOnInit() {
    this.initFields();
  }


  onCloseRefillBalancePopup() {
    this.closeRefillBalancePopup.emit(true);
  }

  chooseRefil(name: string) {
    this.step = 2;
    this.stepTwoName = name;
  }

  private initFields() {
    this.step = 1;
    this.stepTwoName = '';
  }

}
