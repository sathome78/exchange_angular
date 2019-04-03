import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
// import {PopupService} from '../../shared/services/popup.service';
// import {PopupData} from '../../shared/interfaces/popup-data-interface';

@Component({
  selector: 'app-popup-buy',
  templateUrl: './popup-buy.component.html',
  styleUrls: ['./popup-buy.component.scss']
})
export class PopupBuyComponent implements OnInit {

  // @Input() popupData: PopupData;
  @Input() show: boolean;
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(
    // public popupService: PopupService
  ) { }

  ngOnInit() {
  }

  closeMe() {
    // this.popupService.toggleInfoPopup(null);
    this.close.emit();
  }
}
