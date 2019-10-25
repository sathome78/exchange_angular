import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { SyndexOrderInfo } from 'app/funds/models/syndex-order-info.model';
import * as moment from 'moment';

@Component({
  selector: 'app-syndex-disput',
  templateUrl: './syndex-disput.component.html',
  styleUrls: ['./syndex-disput.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyndexDisputComponent implements OnInit {
  @Input() public orderInfo: SyndexOrderInfo;
  public showTextArea = false;

  constructor() { }

  ngOnInit() {
  }

  get canOpenDisput() {
    const end = moment.utc(this.orderInfo.statusModifDate).add(90, 'minutes');
    const start = moment.utc();
    const diff = end.diff(start, 'seconds');
    return diff <= 0;
  }

  public openDisput() {
    this.showTextArea = true;
  }

}
