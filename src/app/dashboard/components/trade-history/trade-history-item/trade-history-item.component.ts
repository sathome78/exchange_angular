import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { TradeItem } from 'app/model/trade-item.model';

@Component({
  selector: 'app-trade-history-item',
  templateUrl: './trade-history-item.component.html',
  styleUrls: ['./trade-history-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeHistoryItemComponent implements OnInit {

  @Input('trade') public trade: TradeItem;

  constructor() { }

  ngOnInit() {
  }

}
