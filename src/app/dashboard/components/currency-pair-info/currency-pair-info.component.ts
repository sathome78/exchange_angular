import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/internal/operators';
import { select, Store } from '@ngrx/store';
import { UserBalance } from 'app/model/user-balance.model';
import {
  State,
  getActiveCurrencyPair,
  getUserBalance,
  getCurrencyPairInfo,
  getSimpleCurrencyPairsSelector
} from 'app/core/reducers/index';
import { DashboardWebSocketService } from '../../dashboard-websocket.service';
import { CurrencyPairInfo } from '../../../model/currency-pair-info.model';
import { UtilsService } from 'app/shared/services/utils.service';
import * as dashboardActions from '../../actions/dashboard.actions';
import { UserService } from 'app/shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
/**
 * Dashboard currency pair information component
 */
@Component({
  selector: 'app-currency-pair-info',
  templateUrl: 'currency-pair-info.component.html',
  styleUrls: ['currency-pair-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyPairInfoComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private pairInfoSub$: Subscription;
  public pair: SimpleCurrencyPair = null;
  public pairInput = '';
  public currentCurrencyInfo: CurrencyPairInfo = null;
  public userBalanceInfo: UserBalance;
  public allCurrencyPairs: SimpleCurrencyPair[] = [];
  public DIOptions: DIOptions[] = [];

  constructor(
    private store: Store<State>,
    private dashboardWebsocketService: DashboardWebSocketService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private utils: UtilsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.store
      .pipe(select(getActiveCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: SimpleCurrencyPair) => {
        this.pair = { name: pair.name, id: pair.id };
        this.pairInput = pair.name;
        this.subscribeCurrInfo(pair.name);
        this.cdr.detectChanges();
      });

    this.store
      .pipe(select(getCurrencyPairInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPairInfo) => {
        this.currentCurrencyInfo = pair;
        this.cdr.detectChanges();
      });

    this.store
      .pipe(select(getSimpleCurrencyPairsSelector))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: SimpleCurrencyPair[]) => {
        this.allCurrencyPairs = pair;
        this.DIOptions = pair
          .map(item => ({ text: item.name, id: item.id }))
          .sort((a, b) => {
            if (a.text.toUpperCase() < b.text.toUpperCase()) {
              return -1;
            }
            if (a.text.toUpperCase() > b.text.toUpperCase()) {
              return 1;
            }
            return 0;
          });
        this.cdr.detectChanges();
      });

    this.store
      .pipe(select(getUserBalance))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((balance: UserBalance) => {
        if (balance.cur1 && balance.cur2) {
          this.userBalanceInfo = balance;
        } else {
          this.userBalanceInfo = null;
        }
        this.cdr.detectChanges();
      });
  }

  subscribeCurrInfo(currName: string): void {
    this.unsubscribeCurrInfo();
    const pairName = currName.toLowerCase().replace(/\//i, '_');
    this.pairInfoSub$ = this.dashboardWebsocketService
      .pairInfoSubscription(pairName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        // console.log('currInfo', data)
        this.store.dispatch(new dashboardActions.RefreshCurrencyPairInfoAction(data));
        this.cdr.detectChanges();
      });
  }

  unsubscribeCurrInfo() {
    if (this.pairInfoSub$) {
      this.pairInfoSub$.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.unsubscribeCurrInfo();
    this.cdr.detach();
  }

  flagForArrow(s: string) {
    if (s === 'up') {
      return this.currentCurrencyInfo ? this.currentCurrencyInfo.percentChange >= 0 : false;
    }
    if (s === 'down') {
      return this.currentCurrencyInfo ? this.currentCurrencyInfo.percentChange < 0 : false;
    }
    return false;
  }

  onChangeCurrPair(val: string): void {
    this.pairInput = val;
  }

  onSelectPair(pairName: string): void {
    const p = this.findCurrencyPair(pairName);
    if (p) {
      this.selectNewCurrencyPair(p);
    } else {
      this.pairInput = this.pair.name;
    }
  }

  onBlurInput() {
    const p = this.findCurrencyPair(this.pairInput);
    if (p && p.name !== this.pair.name) {
      this.selectNewCurrencyPair(p);
    } else {
      this.pairInput = this.pair.name;
    }
  }

  findCurrencyPair(val: string): SimpleCurrencyPair | null {
    return this.allCurrencyPairs.find(item => item.name === val) || null;
  }

  selectNewCurrencyPair(pair: SimpleCurrencyPair) {
    this.store.dispatch(new dashboardActions.ChangeActiveCurrencyPairAction(pair));
    this.utils.saveActiveCurrencyPairToSS(pair);
    this.userService.getUserBalance(pair);
    // if (this.route.snapshot.paramMap.get('currency-pair')) {
    //   this.router.navigate(['/']);
    // }
  }

  isFiat(currNum) {
    const currs = this.pair.name.split('/');
    return this.utils.isFiat(currs[currNum - 1]);
  }
}
