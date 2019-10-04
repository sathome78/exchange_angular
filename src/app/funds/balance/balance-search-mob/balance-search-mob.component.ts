import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromCore from '../../../core/reducers';
import * as fundsReducer from '../../store/reducers/funds.reducer';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BalanceItem } from '../../models/balance-item.model';

@Component({
  selector: 'app-balance-search-mob',
  templateUrl: './balance-search-mob.component.html',
  styleUrls: ['./balance-search-mob.component.scss'],
})
export class BalanceSearchMobComponent implements OnInit, AfterViewInit, OnDestroy {
  private _currTab: any;
  private _Tab: any;

  @Input() set currTab(val) {
    this._currTab = val;
  }
  @Input() set Tab(val) {
    this._Tab = val;
  }
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selectedCurrency: EventEmitter<BalanceItem> = new EventEmitter<BalanceItem>();
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild('input') input: ElementRef;
  @ViewChild('container') container: ElementRef;

  public scrollHeight: number = 0;
  public viewCurrencies = [];
  public defaultCurrencies = [];

  constructor(private cdr: ChangeDetectorRef, private store: Store<fromCore.State>) {}

  ngOnInit() {
    this._currTab === this._Tab.CRYPTO ? this.getCryptoBalances() : this.getFiatBalances();
  }

  ngAfterViewInit() {
    this.input.nativeElement.focus();
    setTimeout(() => {
      this.scrollHeight = this.container.nativeElement.offsetHeight - 143;
      this.cdr.detectChanges();
    }, 0);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  selectCurrency(currency: BalanceItem) {
    this.closeModal.emit(false);
    this.selectedCurrency.emit(currency);
  }

  onSearch(value) {
    this.viewCurrencies = this.defaultCurrencies
      .filter(f => f.currencyName.toLowerCase().includes(value.toLowerCase()));
  }

  private getCryptoBalances() {
    this.store
      .pipe(select(fundsReducer.getCryptoBalancesSelector))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.defaultCurrencies = res;
        this.viewCurrencies = this.defaultCurrencies;
      });
  }

  private getFiatBalances() {
    this.store
      .pipe(select(fundsReducer.getFiatBalancesSelector))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.defaultCurrencies = res;
        this.viewCurrencies = this.defaultCurrencies;
      });
  }
}
