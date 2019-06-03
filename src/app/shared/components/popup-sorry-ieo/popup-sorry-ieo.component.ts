import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-popup-sorry-ieo',
  templateUrl: './popup-sorry-ieo.component.html',
  styleUrls: ['./popup-sorry-ieo.component.scss']
})
export class PopupSorryIEOComponent implements OnInit {

  @Output() public close: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  closeMe() {
    this.close.emit();
  }

}
