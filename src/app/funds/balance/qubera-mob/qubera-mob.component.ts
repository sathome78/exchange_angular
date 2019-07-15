import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-qubera-mob',
  templateUrl: './qubera-mob.component.html',
  styleUrls: ['./qubera-mob.component.scss']
})
export class QuberaMobComponent implements OnInit {

  
  public tableScrollStyles: any = {};

  constructor() { 
    this.setScrollStyles();
  }

  setScrollStyles() {
    const componentHeight = window.innerHeight;
    this.tableScrollStyles = {'height': (componentHeight - 293) + 'px', 'overflow-x': 'scroll'};
  }

  ngOnInit() {
  }

  @Input('Tab') public Tab;
  @Input('currTab') public currTab;
  @Output('onSelectTab') public onSelectTab: EventEmitter<any> = new EventEmitter();
  @Output('openRefillBalancePopup') public openRefillBalancePopup: EventEmitter<any> = new EventEmitter();
  @Output('openSendMoneyPopup') public openSendMoneyPopup: EventEmitter<any> = new EventEmitter();

}