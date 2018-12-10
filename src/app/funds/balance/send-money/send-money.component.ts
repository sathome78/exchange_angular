import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BalanceService} from '../../services/balance.service';

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.scss']
})
export class SendMoneyComponent implements OnInit {

  @Output() closeSendMoneyPopup = new EventEmitter<boolean>();
  public stepTwoName: string;
  public stepThreeName: string;
  public stepThreeData;
  public stepFourData;
  public step: number;

  constructor(
   public balanceService: BalanceService
  ) { }

  onCloseSendMoneyPopup() {
    this.closeSendMoneyPopup.emit(true);
  }

  ngOnInit() {
    this.initFields();
    this.balanceService.goToPinCode$.subscribe(res => {
      console.log(res)
      this.activeStepThree('With code', res);
    });

    this.balanceService.goToSendMoneyInnerTransfer$.subscribe(res => {
      this.activeStepThreeInnerTransfer(res as string);
    })

    this.balanceService.goToSendMoneySuccess$.subscribe(res => {
      console.log(res);
      this.activeSendSuccess(res);
    });
  }

  chooseSend(event: string) {
    this.step = 2;
    this.stepTwoName = event;
  }

  private initFields() {
    this.step = 1;
    this.stepTwoName = '';
  }
  activeStepThreeInnerTransfer(name: string) {
    this.step = 3;
    this.stepThreeName = name;
  }

  activeStepThree(name, data = {}) {
    this.step = 3;
    this.stepThreeName = name;
    this.stepThreeData = data;
  }


  activeSendSuccess(data) {
    this.step = 4;
    this.stepFourData = data;
  }

}
