import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-embedded-open-orders-mobile',
  templateUrl: './embedded-open-orders-mobile.component.html',
  styleUrls: ['./embedded-open-orders-mobile.component.scss']
})
export class EmbeddedOpenOrdersMobileComponent implements OnInit, OnChanges {

  @Output() refreshOpenOrders: EventEmitter<boolean> = new EventEmitter();
  @Input() openOrders = [];

  constructor(
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('openOrders')) {
    }
  }
}
