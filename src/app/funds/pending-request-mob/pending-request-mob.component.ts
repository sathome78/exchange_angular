import {Component, OnInit, EventEmitter, Input, Output, ChangeDetectionStrategy} from '@angular/core';
import {PendingRequestsItem} from 'app/funds/models/pending-requests-item.model';
import {Router} from '@angular/router';
import {Store, select} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import * as fromCore from '../../core/reducers';
import * as fundsAction from '../store/actions/funds.actions';
import * as fundsReducer from '../store/reducers/funds.reducer';
import * as coreAction from '../../core/actions/core.actions';
import {Location} from '@angular/common';
import {takeUntil} from 'rxjs/operators';
import {UtilsService} from 'app/shared/services/utils.service';
import {CurrencyChoose} from 'app/model/currency-choose.model';

@Component({
  selector: 'app-pending-request-mob',
  templateUrl: './pending-request-mob.component.html',
  styleUrls: ['./pending-request-mob.component.scss'],
})
export class PendingRequestMobComponent implements OnInit {

  constructor(
    private router: Router,
    private store: Store<fromCore.State>,
    private location: Location,
    private utils: UtilsService,
  ) {
    const componentHeight = window.innerHeight;
    this.tableScrollStyles = {'height': (componentHeight - 180) + 'px', 'overflow-x': 'scroll'}

    this.pendingRequests$ = store.pipe(select(fundsReducer.getPendingRequestsSelector));
    this.countOfPendingRequests$ = store.pipe(select(fundsReducer.getCountPendingReqSelector));
    this.loading$ = store.pipe(select(fundsReducer.getLoadingSelector));
    this.allCurrenciesForChoose$ = store.pipe(select(fromCore.getAllCurrenciesForChoose));

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
  public allCurrenciesForChoose$: Observable<CurrencyChoose[]>;
  public loading$: Observable<boolean>;
  public countOfPendingRequests$: Observable<number>;
  public tableScrollStyles: any = {};
  public pendingRequests: PendingRequestsItem[] = [];
  public countPerPage: number = 30;
  public currentPage: number = 1;
  public countOfEntries: number = 1;
  public currValue: string = '';
  public currencyForChoose: string = null;

  ngOnInit() {
    this.store.dispatch(new coreAction.LoadAllCurrenciesForChoose());
    this.loadPendingRequests();
  }

  public loadPendingRequests() {
    const paramsP = {
      offset: (this.currentPage - 1) * this.countPerPage,
      currencyName: this.currValue || '',
      limit: this.countPerPage,
      concat: this.currentPage > 1 ? true : false,
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

  public isFiat(currName: string): boolean {
    return this.utils.isFiat(currName);
  }

  public onChangeCurrPair(val: string): void {
    this.currValue = val;
  }

  public onSelectPair(currId: string): void {
    this.currencyForChoose = currId;
    this.currentPage = 1;
    this.loadPendingRequests();
  }

  trackByFn(index, item) {
    return item.requestId;
  }

}
