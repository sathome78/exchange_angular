import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { Animations } from 'app/shared/animations';
import { GAFreeCoinsReqModel } from '../models/GAFreeCoins.model';

@Component({
  selector: 'app-freecoins-popup',
  templateUrl: './freecoins-popup.component.html',
  styleUrls: ['./freecoins-popup.component.scss'],
  animations: [Animations.popupOverlayTrigger, Animations.popupModalTrigger],
})
export class FreecoinsPopupComponent implements OnInit {

  @Output() closeFreeCoinsPopup = new EventEmitter<boolean>();
  @Output() refreshCoins = new EventEmitter<null>();
  @Input() showPopup: boolean;

  public step = 1;
  public formData: GAFreeCoinsReqModel;

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.classList.contains('overlay--modal')) {
      this.onCloseFreeCoinsPopup();
    }
  }

  constructor() {}

  ngOnInit() {

  }

  onCloseFreeCoinsPopup() {
    this.refreshCoins.emit();
    this.showPopup = false;
    setTimeout(() => {
      this.closeFreeCoinsPopup.emit(true);
    }, 1000);
  }

  goNextStep(step) {
    this.step = step;
  }

  submitStep1(data: GAFreeCoinsReqModel) {
    this.formData = data;
    this.goNextStep(2);
  }
}
