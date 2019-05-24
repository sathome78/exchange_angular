import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { KycIEOModel } from 'app/ieo/models/ieo-kyc.model';
import { IEOItem } from 'app/model/ieo.model';

@Component({
  selector: 'app-popup-failed',
  templateUrl: './popup-failed.component.html',
  styleUrls: ['./popup-failed.component.scss'],
})
export class PopupFailedComponent implements OnInit {

  @Input() requirements: KycIEOModel;
  @Input() IEOData: IEOItem;
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  closeMe() {
    this.close.emit();
  }
}
