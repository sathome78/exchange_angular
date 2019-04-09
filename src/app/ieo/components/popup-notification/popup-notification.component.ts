import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
// import {PopupService} from '../../shared/services/popup.service';
// import {PopupData} from '../../shared/interfaces/popup-data-interface';

@Component({
  selector: 'app-popup-notification',
  templateUrl: './popup-notification.component.html',
  styleUrls: ['./popup-notification.component.scss']
})
export class PopupNotificationComponent implements OnInit {

  @Input() show: boolean;
  @Input() header: string = '';
  @Input() line1: string = '';
  @Input() line2: string = '';
  @Input() btnText: string = 'Ok';
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeMe() {
    this.close.emit();
  }
}
