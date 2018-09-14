import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {LoggingService} from './logging.service';

@Injectable()
export class PopupService {

  private onOpenTFAPopupListener = new Subject<string>();
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

  showTFAPopup(provider: string) {
    this.onOpenTFAPopupListener.next(provider);
    if (provider === 'GOOGLE' || provider === 'SMS' || provider === 'TELEGRAM') {
      this.tfaProvider = provider;
    }
  }

  closeTFAPopup() {
    this.onOpenTFAPopupListener.next(undefined);
  }


  public getTFAPopupListener(): Subject<string> {
    return this.onOpenTFAPopupListener;
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

}

export interface OnNextStep {

  onNextStep();
}

