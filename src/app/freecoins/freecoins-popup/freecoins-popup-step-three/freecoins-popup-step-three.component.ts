import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-freecoins-popup-step-three',
  templateUrl: './freecoins-popup-step-three.component.html',
  styleUrls: ['./freecoins-popup-step-three.component.scss'],
})
export class FreecoinsPopupStepThreeComponent implements OnInit {
  @Output() public close = new EventEmitter<null>();

  constructor() { }

  ngOnInit() {
  }

  onClose() {
    this.close.emit();
  }

}
