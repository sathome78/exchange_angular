import {Component, OnInit} from '@angular/core';

import {AbstractDashboardItems} from '../abstract-dashboard-items';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent extends AbstractDashboardItems implements OnInit {
  /** dashboard item name (field for base class)*/
  public itemName: string;

  constructor() {
    super();
  }

  ngOnInit() {
    this.itemName = 'chat';
  }

}
