import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class PopupService {

  private onOpenTFAPopupListener = new Subject<string>();

  showTFAPopup(provider: string) {
    this.onOpenTFAPopupListener.next(provider);
  }

  public getTFAPopupListener(): Subject<string> {
    return this.onOpenTFAPopupListener;
  }

}
