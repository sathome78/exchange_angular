import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BalanceService} from '../../services/balance.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {WITH_CODE} from './send-money-constants';

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.scss']
})
export class SendMoneyComponent implements OnInit, OnDestroy {

  @Output() closeSendMoneyPopup = new EventEmitter<boolean>();
  @Input() optionData;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public stepTwoName: string;
  public stepThreeName: string;
  public stepThreeData;
  public stepFourData;
  public step: number;

  constructor(
    public balanceService: BalanceService
  ) {
  }

  onCloseSendMoneyPopup() {
    this.closeSendMoneyPopup.emit(true);
  }

  ngOnInit() {
    this.initFields();
    this.balanceService.goToPinCode$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.activeStepThree(WITH_CODE, res);
      });

    this.balanceService.goToSendMoneyInnerTransfer$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.activeStepThreeInnerTransfer(res as string);
      });

    this.balanceService.goToSendMoneySuccess$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.activeSendSuccess(res);
      });

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  chooseSend(event: string) {
    this.step = 2;
    this.stepTwoName = event;
  }

  private initFields() {
    this.step = this.optionData.step ? this.optionData.step : 1;
    this.stepTwoName = this.optionData.stepName ? this.optionData.stepName : '';
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
