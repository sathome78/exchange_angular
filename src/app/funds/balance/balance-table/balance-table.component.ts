import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { BalanceItem } from '../../models/balance-item.model';
import { DetailedCurrencyPair } from '../../../model/detailed-currency-pair';
import { Animations } from 'app/shared/animations';

@Component({
  selector: 'app-balance-table',
  templateUrl: './balance-table.component.html',
  styleUrls: ['./balance-table.component.scss'],
  animations: [Animations.componentTriggerBallanceAnimation],
})
export class BalanceTableComponent implements OnInit, OnDestroy  {
  constructor() {}

  public activeTab = false;
  @Input() public leaveAnimationFn: boolean;
  @Input() public balances: BalanceItem[] = [];
  @Input() public allPairs: DetailedCurrencyPair[] = [];
  @Input() public countPerPage: number;
  @Input() public loading: boolean;
  @Input() public currentPage: number;
  @Input() public countOfEntries: number;
  @Output() public paginate: EventEmitter<any> = new EventEmitter();
  @Output() public cryptoWithdrawOut: EventEmitter<any> = new EventEmitter();
  @Output() public cryptoDepositOut: EventEmitter<any> = new EventEmitter();
  @Output() public transferOut: EventEmitter<any> = new EventEmitter();

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

  trackByFn(index, item) {
    return item.currencyId;
  }

  ngOnInit() {
    setTimeout(() => {
      this.activeTab = true;
    }, 1900);
  }

  ngOnDestroy() {
    this.activeTab = false;
  }
}
