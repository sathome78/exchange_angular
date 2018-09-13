import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class PopupService {

  private onOpenTFAPopupListener = new Subject<string>();
  private tfaProvider = '';
  stepsMap: Map<number, string> = new Map<number, string>();


  constructor() {
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

  public getTFAProvider(): string {
    return this.tfaProvider;
  }

}
