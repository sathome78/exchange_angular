import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {LoggingService} from './logging.service';

@Injectable()
export class PopupService {

  private onOpenTFAPopupListener = new Subject<string>();
  private onOpenIdentityPopupListener = new Subject<string>();
  private onLoginPopupListener = new Subject<boolean>();
  private onDemoTradingPopupListener = new Subject<boolean>();
  private onRecoveryPasswordListener = new Subject<boolean>();
  private onMobileLoginPopupListener = new Subject<boolean>();
  private onMobileRegistrationPopupListener = new Subject<boolean>();
  private onAlreadyRegisteredPopupListener = new Subject<boolean>();
  private onAlreadyRestoredPasswordPopupListener = new Subject<boolean>();
  private onRestoredPasswordPopupListener = new Subject<boolean>();
  private onSessionTimeSavedPopupListener = new Subject<boolean>();
  private onChangedPasswordPopupListener = new Subject<boolean>();
  private stepListener = new Subject<number>();
  private currentStep = 1;
  private tfaProvider = '';
  private identityDocumentType = 'PASSPORT';
  public demoPopupMessage = 0;
  stepsMap: Map<number, string> = new Map<number, string>();


  constructor(private logger: LoggingService) {
    this.stepsMap.set(1, 'By passport');
    this.stepsMap.set(2, 'Submit ID');
    this.stepsMap.set(3, 'Capture by camera');
    this.stepsMap.set(4, 'By nick with pass');
  }

  showIdentityPopup(mode: string) {
    this.identityDocumentType = mode;
    this.onOpenIdentityPopupListener.next(this.identityDocumentType);
  }

  showLoginPopup(state: boolean) {
    this.onLoginPopupListener.next(state);
  }

  showDemoTradingPopup(state: boolean) {
    this.onDemoTradingPopupListener.next(state);
  }

  showMobileLoginPopup(state: boolean) {
    this.onMobileLoginPopupListener.next(state);
  }

  showRecoveryPasswordPopup(state: boolean) {
    this.onRecoveryPasswordListener.next(state);
  }


  showMobileRegistrationPopup(state: boolean) {
    this.onMobileRegistrationPopupListener.next(state);
  }

  showTFAPopup(provider: string) {
    if (provider === 'GOOGLE' || provider === 'SMS' || provider === 'TELEGRAM' || provider === 'GOOGLE_DISABLED') {
      this.tfaProvider = provider;
    }
    this.stepsMap = this.getStepsMap(provider);
    this.onOpenTFAPopupListener.next(provider);
  }

  closeTFAPopup() {
    this.onOpenTFAPopupListener.next(undefined);
  }

  closeIdentityPopup() {
    this.onOpenIdentityPopupListener.next(undefined);
  }

  public getTFAPopupListener(): Subject<string> {
    return this.onOpenTFAPopupListener;
  }

  public getIdentityPopupListener(): Subject<string> {
    return this.onOpenIdentityPopupListener;
  }

  public getLoginPopupListener(): Subject<boolean> {
    return this.onLoginPopupListener;
  }

  public getRecoveryPasswordListener(): Subject<boolean> {
    return this.onRecoveryPasswordListener;
  }

  public getLoginMobilePopupListener(): Subject<boolean> {
    return this.onMobileLoginPopupListener;
  }

  public getDemoTradingPopupListener(): Subject<boolean> {
    return this.onDemoTradingPopupListener;
  }

  public getAlreadyRegisteredPopupListener(): Subject<boolean> {
    return this.onAlreadyRegisteredPopupListener;
  }

  public getRestoredPasswordPopupListener(): Subject<boolean> {
    return this.onRestoredPasswordPopupListener;
  }

  public getChangedPasswordPopupListener(): Subject<boolean> {
    return this.onChangedPasswordPopupListener;
  }

  public getAlreadyRestoredPasswordPopupListener(): Subject<boolean> {
    return this.onAlreadyRestoredPasswordPopupListener;
  }

  public getSessionTimeSavedPopupListener(): Subject<boolean> {
    return this.onSessionTimeSavedPopupListener;
  }

  public getRegistrationMobilePopupListener(): Subject<boolean> {
    return this.onMobileRegistrationPopupListener;
  }

  public getCurrentStepListener(): Subject<number> {
    return this.stepListener;
  }

  public getTFAProvider(): string {
    return this.tfaProvider;
  }


  public getIdentityDocumentType(): string {
    return this.identityDocumentType;
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
      case 'GOOGLE_DISABLED':
      return this.getGoogleDisableStepsMap();
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
    // map.set(4, 'Enter the code');
    return map;
  }

  getGoogleDisableStepsMap(): Map<number, string> {
    const map = new Map<number, string>();
    map.set(1, 'Disable');
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

  closeLoginPopup() {
    this.onLoginPopupListener.next(false);
  }

  closeDemoTradingPopup() {
    this.onDemoTradingPopupListener.next(false);
  }

  toggleAlreadyRegisteredPopup(state: boolean) {
    this.onAlreadyRegisteredPopupListener.next(state);
  }

  toggleAlreadyRestoredPasswordPopup(state: boolean) {
    this.onAlreadyRestoredPasswordPopupListener.next(state);
  }

  toggleRestoredPasswordPopup(state: boolean) {
    this.onRestoredPasswordPopupListener.next(state);
  }

  toggleSessionTimeSavedPopup(state: boolean) {
    this.onSessionTimeSavedPopupListener.next(state);
  }

  toggleChangedPasswordPopup(state: boolean) {
    this.onChangedPasswordPopupListener.next(state);
  }

  closeRecoveryPasswordPopup() {
    this.onRecoveryPasswordListener.next(false);
  }

  closeMobileLoginPopup() {
    this.onMobileLoginPopupListener.next(false);
  }

  closeRegistrationPopup() {
    this.onMobileRegistrationPopupListener.next(false);
  }

}

export interface OnNextStep {

  onNextStep();
}

