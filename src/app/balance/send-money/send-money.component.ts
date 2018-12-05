import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.scss']
})
export class SendMoneyComponent implements OnInit {

  @Output() closeSendMoneyPopup = new EventEmitter<boolean>();

  constructor() { }

  onCloseSendMoneyPopup() {
    this.closeSendMoneyPopup.emit(true);
  }

  ngOnInit() {
  }

}
