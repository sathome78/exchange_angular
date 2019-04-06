import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
// import {PopupService} from '../../shared/services/popup.service';
// import {PopupData} from '../../shared/interfaces/popup-data-interface';

@Component({
  selector: 'app-popup-policy',
  templateUrl: './popup-policy.component.html',
  styleUrls: ['./popup-policy.component.scss']
})
export class PopupPolicyComponent implements OnInit {

  // @Input() popupData: PopupData;
  @Input() show: boolean;
  @Input() header: string = '';
  @Input() line1: string = '';
  @Input() line2: string = '';
  @Input() btnText: string = 'Ok';
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
