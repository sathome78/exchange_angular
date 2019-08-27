import { Component, OnInit, OnDestroy } from '@angular/core';
import { PendingRequestsItem } from '../models/pending-requests-item.model';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromCore from '../../core/reducers';
import * as fundsAction from '../store/actions/funds.actions';
import * as fundsReducer from '../store/reducers/funds.reducer';
import { Subject, Observable } from 'rxjs';
import { UtilsService } from 'app/shared/services/utils.service';

@Component({
  selector: 'app-pending-request-details',
  templateUrl: './pending-request-details.component.html',
  styleUrls: ['./pending-request-details.component.scss'],
})
export class PendingRequestDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<fromCore.State>,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private utils: UtilsService
  ) {
    this.loading$ = store.pipe(select(fundsReducer.getLoadingSelector));
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      const data = params['detailsItem'];
      this.detailsItem = data ? JSON.parse(data) : null;
      if (!this.detailsItem) {
        this.router.navigate(['/funds/balances']);
        return;
      }
      this.location.replaceState(this.location.path().split('?')[0], '');
    });
  }

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public loading$: Observable<boolean>;
  public pendingRequestsItem = PendingRequestsItem;
  public detailsItem: PendingRequestsItem = null;
  public showRevokeModal = false;

  ngOnInit() {}

  public onHideDetails(): void {
    this.location.back();
  }

  public onShowInfo(): void {}

  public toggleRevokeModal(val: boolean): void {
    this.showRevokeModal = val;
  }
  public onRevoke(): void {
    this.showRevokeModal = false;
    const params = {
      requestId: this.detailsItem.requestId,
      operation: this.detailsItem.operation,
    };
    this.store.dispatch(new fundsAction.RevokePendingReqMobileAction(params));
  }

  public onGoBack(): void {
    this.location.back();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
