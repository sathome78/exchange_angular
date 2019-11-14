import { Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { PendingRequestsItem } from '../../models/pending-requests-item.model';
import { UtilsService } from 'app/shared/services/utils.service';

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
  @Input() public leaveAnimationFn : boolean;
  @Input('pendingRequests') public pendingRequests: PendingRequestsItem[] = [];
  @Input('countPerPage') public countPerPage: number;
  @Input('currentPage') public currentPage: number;
  @Input('loading') public loading: boolean;
  @Input('countOfEntries') public countOfEntries: number;
  @Output('onPaginate') public onPaginate: EventEmitter<any> = new EventEmitter();
  @Output('onRevokePendingRequest') public onRevokePendingRequest: EventEmitter<any> = new EventEmitter();

  public changeItemsPerPage(items: number) {
    this.onPaginate.emit({
      currentPage: this.currentPage,
      countPerPage: items,
    });
  }

  public changePage(page: number): void {
    this.onPaginate.emit({
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
    this.onRevokePendingRequest.emit({
      requestId: item.requestId,
      operation: item.operation,
    });
  }

  ngOnInit() {}

  trackByFn(index, item) {
    return item.requestId;
  }
}
