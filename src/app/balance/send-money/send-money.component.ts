import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.scss']
})
export class SendMoneyComponent implements OnInit {

  @Output() closeSendMoneyPopup = new EventEmitter<boolean>();
  public stepTwoName: string;
  public step: number;

  constructor() { }

  onCloseSendMoneyPopup() {
    this.closeSendMoneyPopup.emit(true);
  }

  ngOnInit() {
    this.initFields();
  }

  chooseSend(event: string) {
    this.step = 2;
    this.stepTwoName = event;
  }

  private initFields() {
    this.step = 1;
    this.stepTwoName = '';
  }

}
