import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IEOItem } from 'app/model/ieo.model';

@Component({
  selector: 'app-popup-policy',
  templateUrl: './popup-policy.component.html',
  styleUrls: ['./popup-policy.component.scss'],
})
export class PopupPolicyComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() agree: EventEmitter<any> = new EventEmitter();
  @Input() IEOName: string;

  constructor() {}

  ngOnInit() {}

  closeMe() {
    this.close.emit();
  }
}
