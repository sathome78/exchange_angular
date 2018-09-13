import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class PopupService {

  private onOpenTFAPopupListener = new Subject<string>();
  private tfaProvider = '';

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
