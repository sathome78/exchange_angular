import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import {Animations} from '../../../shared/animations';
import { BalanceService } from 'app/funds/services/balance.service';

@Component({
  selector: 'app-qubera-popup',
  templateUrl: './qubera-popup.component.html',
  styleUrls: ['./qubera-popup.component.scss'],
  animations: [
    Animations.popupOverlayTrigger, Animations.popupModalTrigger
  ]
})
export class QuberaPopupComponent implements OnInit {

  @Input() showPopup;
  @Input() optionData;
  @Input() steper;
  @Output() closeSendQuberaPopupMain = new EventEmitter<boolean>();
  @Output() getKYCStatus = new EventEmitter<boolean>();
  component: any;

  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.classList.contains('overlay--modal')) {
      this.onCloseSendQuberaPopupMain();
    }
  }
  constructor(public balanceService: BalanceService) { }

  
  onCloseSendQuberaPopupMain() {
    this.showPopup = false;
    setTimeout(() => {
      this.getKYCStatus.emit(true);
      this.closeSendQuberaPopupMain.emit(true);
    }, 1000);
  }

  ngOnInit() {
    this.setComponent();
  }

  


  getStatusKYC() {
    this.getKYCStatus.emit(true);
  }

  setComponent() {
    this.component = this.optionData.component;
  }

}
