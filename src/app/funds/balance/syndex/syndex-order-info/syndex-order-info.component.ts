import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { SyndexOrderInfo } from 'app/funds/models/syndex-order-info.model';

@Component({
  selector: 'app-syndex-order-info',
  templateUrl: './syndex-order-info.component.html',
  styleUrls: ['./syndex-order-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyndexOrderInfoComponent implements OnInit {
  @Input() public orderInfo: SyndexOrderInfo;

  constructor() { }

  ngOnInit() {
  }

}
