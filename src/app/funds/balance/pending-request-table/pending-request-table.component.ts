import { Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { PendingRequestsItem } from '../../models/pending-requests-item.model';
import { UtilsService } from 'app/shared/services/utils.service';
import { SyndexService } from 'app/funds/services/syndex.service';

@Component({
  selector: 'app-pending-request-table',
  templateUrl: './pending-request-table.component.html',
  styleUrls: ['./pending-request-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingRequestTableComponent implements OnInit {
  public showRevokeModal = false;
  public revokeModalId;

  constructor(private utils: UtilsService) {}

  @Input() public pendingRequests: PendingRequestsItem[] = [];
  @Input() public countPerPage: number;
  @Input() public currentPage: number;
  @Input() public loading: boolean;
  @Input() public countOfEntries: number;
  @Output() public paginate: EventEmitter<any> = new EventEmitter();
  @Output() public revokePendingRequest: EventEmitter<any> = new EventEmitter();
  @Output() public selectSyndexOrder: EventEmitter<any> = new EventEmitter();

  public changeItemsPerPage(items: number) {
    this.paginate.emit({
      currentPage: this.currentPage,
      countPerPage: items,
    });
  }

  public changePage(page: number): void {
    this.paginate.emit({
      currentPage: page,
      countPerPage: this.countPerPage,
    });
  }

  public toggleRevokeModal(value: boolean, modalId: number): void {
    this.revokeModalId = modalId;
    this.showRevokeModal = value;
  }
  public onRevoke(item): void {
    this.showRevokeModal = false;
    this.revokePendingRequest.emit({
      requestId: item.requestId,
      operation: item.operation,
    });
  }

  public openSyndexOrder(orderId) {
    this.selectSyndexOrder.emit(orderId);
  }

  ngOnInit() {}

  trackByFn(index, item) {
    return item.requestId;
  }
}
