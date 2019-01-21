import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thank-you-popup',
  templateUrl: './thank-you-popup.component.html',
  styleUrls: ['./thank-you-popup.component.scss']
})
export class ThankYouPopupComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  closeMe() {
    console.log('');
  }

}
