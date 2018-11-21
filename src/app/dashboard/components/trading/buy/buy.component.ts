import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buy',
  templateUrl: 'buy.component.html',
  styleUrls: ['buy.component.scss']
})
export class BuyComponent implements OnInit {

  public isDpropdownOpen = false;

  constructor() { }

  ngOnInit() {
  }

  toggleLimitDropdown() {
    this.isDpropdownOpen = !this.isDpropdownOpen;
  }

}
