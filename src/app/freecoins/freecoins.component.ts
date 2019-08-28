import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-freecoins',
  templateUrl: './freecoins.component.html',
  styleUrls: ['./freecoins.component.scss']
})
export class FreecoinsComponent implements OnInit {
  public showFreeCoinsPopup = true;

  constructor() { }

  ngOnInit() {
  }

  toggleFreeCoinsPopup(value) {
    this.showFreeCoinsPopup = value;
  }

}
