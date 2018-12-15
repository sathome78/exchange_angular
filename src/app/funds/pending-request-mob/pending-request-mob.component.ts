import {Component, OnInit, EventEmitter, Input, Output, ChangeDetectionStrategy} from '@angular/core';
import {PendingRequestsItem} from 'app/funds/models/pending-requests-item.model';
import {Router} from '@angular/router';
import {Store, select} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import * as fromCore from '../../core/reducers';
import * as fundsAction from '../store/actions/funds.actions';
import * as fundsReducer from '../store/reducers/funds.reducer';
import { Location } from '@angular/common';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pending-request-mob',
  templateUrl: './pending-request-mob.component.html',
  styleUrls: ['./pending-request-mob.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingRequestMobComponent implements OnInit {

  constructor(
    private router: Router,
    private store: Store<fromCore.State>,
    private location: Location,
  ) { 
    const componentHeight = window.innerHeight;
    this.tableScrollStyles = {'height': (componentHeight - 102) + 'px', 'overflow': 'scrollY'}

    this.pendingRequests$ = store.pipe(select(fundsReducer.getPendingRequestsSelector));
    this.countOfPendingRequests$ = store.pipe(select(fundsReducer.getCountPendingReqSelector));

    this.countOfPendingRequests$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.countOfEntries = res;
      })
    this.pendingRequests$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.pendingRequests = res;
      })

  }
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public pendingRequests$: Observable<PendingRequestsItem[]>;
  public countOfPendingRequests$: Observable<number>;
  public tableScrollStyles: any = {};
  public pendingRequests: PendingRequestsItem[] = [];
  public countPerPage: number = 30;
  public currentPage: number = 1;
  public countOfEntries: number = 1;

  ngOnInit() {

  }

  public loadPendingRequests() {
    const paramsP = {
      offset: (this.currentPage - 1) * this.countPerPage,
      limit: this.countPerPage,
      concat: true,
    };
    return this.store.dispatch(new fundsAction.LoadPendingReqAction(paramsP));
  };

  public onGoBack(): void {
    this.location.back()
  }

  public onLoadMoreTrigger(): void {
    if(this.pendingRequests.length !== this.countOfEntries){
      this.currentPage +=1
      this.loadPendingRequests(); 
    }
  }

  public onShowDetails(item: PendingRequestsItem): void {
    this.router.navigate([`/funds/pending-requests/${item.requestId}`], {queryParams:{detailsItem: JSON.stringify(item)}})
  }
  

}
