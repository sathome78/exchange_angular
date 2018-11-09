import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopupService} from '../../services/popup.service';
import {generate, Subscription} from 'rxjs';
import {LoggingService} from '../../services/logging.service';
import {e} from '@angular/core/src/render3';

@Component({
  selector: 'app-two-factor-popup',
  templateUrl: './two-factor-popup.component.html',
  styleUrls: ['./two-factor-popup.component.scss']
})
export class TwoFactorPopupComponent implements OnInit, OnDestroy {

  google = 'GOOGLE';
  sms = 'SMS';
  telegram = 'TELEGRAM';
  google_disable = 'GOOGLE_DISABLE';
  provider: string;
  step = 1;
  stepsSize = 1;

  private currentStepSubscription: Subscription;

  constructor(private popupService: PopupService,
              private logger: LoggingService) {
  }

  ngOnInit() {
    this.provider = this.popupService.getTFAProvider();
    this.logger.debug(this, 'Provider on init is: ' + this.provider);
    this.popupService.loadDefault();
    this.stepsSize = this.popupService.getStepsMap(this.provider).size;
    this.currentStepSubscription = this.popupService
      .getCurrentStepListener()
      .subscribe(currentStep => this.step = currentStep);
  }

  closePopup() {
    this.logger.debug(this, 'Attempt to close popup ');
    this.popupService.closeTFAPopup();
  }

  getValue(value: any) {
    this.logger.debug(this, 'By TFA tfaSubscription received: ' + value);
    if (value === this.google || value === this.sms || value === this.telegram || value === this.google_disable) {
      this.provider = value;
    }
  }

  getStepName(number: number): string {
    return this.popupService.stepsMap.get(number);
  }

  moveNext(step: number) {
    this.popupService.movePreviousStep(step);
  }

  ngOnDestroy() {
    this.currentStepSubscription.unsubscribe();
  }
}
