import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {LoggingService} from './logging.service';

@Injectable()
export class PopupService {

  private onOpenTFAPopupListener = new Subject<string>();
  private onOpenIdentityPopupListener = new Subject<string>();
  private stepListener = new Subject<number>();
  private currentStep = 1;
  private tfaProvider = '';
  stepsMap: Map<number, string> = new Map<number, string>();


  constructor(private logger: LoggingService) {
    this.stepsMap.set(1, 'By passport');
    this.stepsMap.set(2, 'Submit ID');
    this.stepsMap.set(3, 'Capture by camera');
    this.stepsMap.set(4, 'By nick with pass');
  }

  showIdentityPopup(mode: string) {
    this.onOpenIdentityPopupListener.next(mode);
  }

  showTFAPopup(provider: string) {
    this.onOpenTFAPopupListener.next(provider);
    if (provider === 'GOOGLE' || provider === 'SMS' || provider === 'TELEGRAM') {
      this.tfaProvider = provider;
    }
    this.stepsMap = this.getStepsMap(provider);
  }

  closeTFAPopup() {
    this.onOpenTFAPopupListener.next(undefined);
  }


  public getTFAPopupListener(): Subject<string> {
    return this.onOpenTFAPopupListener;
  }

  public getIdentityPopupListener(): Subject<string> {
    return this.onOpenIdentityPopupListener;
  }

  public getCurrentStepListener(): Subject<number> {
    return this.stepListener;
  }

  public getTFAProvider(): string {
    return this.tfaProvider;
  }

  public moveNextStep() {
    const nextStep = this.currentStep + 1;
    if (nextStep <= this.stepsMap.size) {
      this.stepListener.next(++this.currentStep);
      this.logger.debug(this, 'Moved to next step: ' + nextStep);
    } else {
      this.logger.info(this, 'Next step is beyond the available steps: ' + nextStep);
    }
  }

  public movePreviousStep(step: number) {
    if (step > 0 && step <= this.stepsMap.size) {
      this.stepListener.next(step);
      this.currentStep = step;
      this.logger.debug(this, 'Moved to previous step: ' + step);
    }
  }

  getStepsMap(provider: string) {
    switch (provider) {
      case 'GOOGLE':
        return this.getGoogleStepsMap();
      case 'SMS':
        return this.getSmsStepsMap();
      case 'TELEGRAM':
        return this.getTelegramStepsMap();
      default:
        return new Map<number, string>();
    }
  }

  getGoogleStepsMap(): Map<number, string> {
    const map = new Map<number, string>();
    map.set(1, 'Download App');
    map.set(2, 'Scan QR-code');
    map.set(3, 'Save backup code');
    map.set(4, 'Enter the code');
    return map;
  }

  getSmsStepsMap(): Map<number, string> {
    const map = new Map<number, string>();
    map.set(1, 'Get verification code');
    map.set(2, 'Pay and connect');
    return map;
  }

  getTelegramStepsMap(): Map<number, string> {
    const map = new Map<number, string>();
    map.set(1, 'Step #1');
    map.set(2, 'Step #2');
    return map;
  }

  loadDefault() {
    this.movePreviousStep(1);
  }

}

export interface OnNextStep {

  onNextStep();
}

