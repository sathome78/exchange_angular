import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ieo',
  templateUrl: './ieo.component.html',
  styleUrls: ['./ieo.component.scss']
})
export class IEOComponent implements OnInit {

  public showNotification: boolean = false;
  public showBuy: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  openNotification() {
    this.showNotification = true;
  }
  openBuy() {
    this.showBuy = true;
  }
  closeNotification() {
    this.showNotification = false;
  }
  closeBuy() {
    this.showBuy = false;
  }

}
