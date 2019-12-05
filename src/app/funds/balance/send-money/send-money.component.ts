import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BalanceService } from '../../services/balance.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QUBERA, WITH_CODE, INNER_TRANSFER } from './send-money-constants';
import { Animations } from '../../../shared/animations';

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.scss'],
  animations: [Animations.popupOverlayTrigger, Animations.popupModalTrigger],
})
export class SendMoneyComponent implements OnInit, OnDestroy {
  @Output() closeSendMoneyPopup = new EventEmitter<boolean>();
  @Output() toggleBalanceTab = new EventEmitter<string>();
  @Input() optionData;
  @Input() showPopup;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public stepTwoName: string;
  public stepThreeName: string;
  public stepThreeData;
  public stepFourData;
  public step: number;

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.classList.contains('overlay--modal')) {
      this.onCloseSendMoneyPopup();
    }
  }

  constructor(public balanceService: BalanceService) {}

  onCloseSendMoneyPopup() {
    this.showPopup = false;
    setTimeout(() => {
      this.closeSendMoneyPopup.emit(true);
    }, 1000);
  }

  ngOnInit() {
    this.initFields();
    this.balanceService.goToPinCode$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.activeStepThree(WITH_CODE, res);
    });

    this.balanceService.goToSendMoneyInnerTransfer$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.activeStepThreeInnerTransfer(res as string);
    });

    this.balanceService.goToSendMoneySuccess$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.activeSendSuccess(res);
    });
  }

  setStep(step: number) {
    this.step = step;
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
    this.stepThreeData = this.optionData.stepThreeData ? this.optionData.stepThreeData : null;
  }

  activeStepThreeInnerTransfer(res: any) {
    this.step = 3;
    this.stepThreeName = res.name;
    this.stepThreeData = res.merchant;
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

  public get isMobile(): boolean {
    return window.innerWidth <= 1200;
  }
}
