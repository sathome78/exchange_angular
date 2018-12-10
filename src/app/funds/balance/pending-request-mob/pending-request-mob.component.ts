import {Component, OnInit, EventEmitter, Input, Output, ChangeDetectionStrategy} from '@angular/core';
import {PendingRequestsItem} from 'app/funds/models/pending-requests-item.model';

@Component({
  selector: 'app-pending-request-mob',
  templateUrl: './pending-request-mob.component.html',
  styleUrls: ['./pending-request-mob.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingRequestMobComponent implements OnInit {

  constructor() { }

  public pendingRequestsItem = PendingRequestsItem;
  public screen = {
    MAIN: 'MAIN',
    DETAILS: 'DETAILS',
    INFO: 'INFO'
  }
  public currScreen: string = this.screen.MAIN;
  public detailsItem: PendingRequestsItem = null;

  @Input('pendingRequests') public pendingRequests: PendingRequestsItem[] = [];
  @Input('countPerPage') public countPerPage: number;
  @Input('currentPage') public currentPage: number;
  @Input('countOfEntries') public countOfEntries: number;
  @Input('Tab') public Tab;
  @Input('currTab') public currTab;
  @Output('onPaginate') public onPaginate: EventEmitter<any> = new EventEmitter();
  @Output('onSelectTab') public onSelectTab: EventEmitter<any> = new EventEmitter();
  @Output('openRefillBalancePopup') public openRefillBalancePopup: EventEmitter<any> = new EventEmitter();
  @Output('openSendMoneyPopup') public openSendMoneyPopup: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }

  public onShowDetails(item: PendingRequestsItem): void {
    this.detailsItem = item;
    this.currScreen = this.screen.DETAILS;
  }
  public onHideDetails(): void {
    this.detailsItem = null;
    this.currScreen = this.screen.MAIN;
  }
  public onShowInfo(): void {
    this.currScreen = this.screen.INFO;
  }
  public onHideInfo(): void {
    this.currScreen = this.screen.DETAILS;
  }

}
