import { Component, OnDestroy, OnInit, Input, HostListener } from '@angular/core';
import { PopupService } from '../../shared/services/popup.service';
import { Subscription, Subject } from 'rxjs';
import { LoggingService } from '../../shared/services/logging.service';
import { Animations } from 'app/shared/animations';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-two-factor-popup',
  templateUrl: './two-factor-popup.component.html',
  styleUrls: ['./two-factor-popup.component.scss'],
  animations: [
    Animations .popupOverlayTrigger, Animations.popupModalTrigger,
  ],
})
export class TwoFactorPopupComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  google = 'GOOGLE';
  sms = 'SMS';
  telegram = 'TELEGRAM';
  google_disable = 'GOOGLE_DISABLED';
  provider: string;
  step = 1;
  stepsSize = 1;
  @Input('showPopup') public showPopup: boolean = false;

  private currentStepSubscription: Subscription;

   /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.classList.contains('overlay--modal')) {
      this.closePopup();
    }
  }

  constructor(private popupService: PopupService,
              private logger: LoggingService) {
  }

  ngOnInit() {
    this.provider = this.popupService.getTFAProvider();
    this.logger.debug(this, 'Provider on init is: ' + this.provider);
    this.popupService.loadDefault();
    this.stepsSize = this.popupService.getStepsMap(this.provider).size;
    this.popupService.getCurrentStepListener()
      .pipe(takeUntil(this.ngUnsubscribe))
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
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
