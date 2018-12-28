import {Component, OnInit, OnDestroy} from '@angular/core';
import {BalanceDetailsItem} from 'app/funds/models/balance-details-item.model';
import {DashboardWebSocketService} from 'app/dashboard/dashboard-websocket.service';
import {Router, ActivatedRoute} from '@angular/router';
import {Store, select} from '@ngrx/store';
import * as fromCore from '../../core/reducers';
import {Observable, Subject} from 'rxjs';
import * as fundsReducer from '../store/reducers/funds.reducer';
import * as fundsAction from '../store/actions/funds.actions';
import * as coreAction from '../../core/actions/core.actions';
import {takeUntil} from 'rxjs/operators';
import {Location} from '@angular/common';
import {BalanceItem} from 'app/funds/models/balance-item.model';
import {CRYPTO_DEPOSIT, CRYPTO_WITHDRAWAL, INNER_TRANSFER, FIAT_DEPOSIT} from '../balance/send-money/send-money-constants';
import {BalanceService} from 'app/funds/services/balance.service';
import {PopupService} from '../../shared/services/popup.service';
import { UtilsService } from 'app/shared/services/utils.service';

@Component({
  selector: 'app-balance-details',
  templateUrl: './balance-details.component.html',
  styleUrls: ['./balance-details.component.scss']
})
export class BalanceDetailsComponent implements OnInit, OnDestroy {

  public currencies = {
    BTC: 'BTC',
    USD: 'USD',
  }
  constructor(
    private store: Store<fromCore.State>,
    private dashboardWS: DashboardWebSocketService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private balanceService: BalanceService,
    private utils: UtilsService,
    private popupService: PopupService
  ) {
    this.selectedBalance$ = store.pipe(select(fundsReducer.getSelectedBalance));

    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(params => {
        const currencyId = +params['id'];
        this.store.dispatch(new fundsAction.LoadBalanceDetailsAction(currencyId))
      });
    this.route.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(params => {
        this.priceIn = params['priceIn'];
        this.location.replaceState(this.location.path().split('?')[0], '')
      });

    this.store.dispatch(new coreAction.LoadAllCurrenciesForChoose());
    this.store.dispatch(new coreAction.LoadCryptoCurrenciesForChoose());
    this.store.dispatch(new coreAction.LoadFiatCurrenciesForChoose());
  }

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public selectedBalance$: Observable<BalanceDetailsItem>;
  public selectedItem: BalanceDetailsItem = new BalanceDetailsItem();
  public showOnConfirmation: boolean = false;
  public showReserve: boolean = false;
  public priceIn: string = this.currencies.USD;

  public sendMoneyData = {};
  public refillBalanceData = {};
  public showRefillBalancePopup: boolean = false;
  public showSendMoneyPopup: boolean = false;

  ngOnInit() {
    this.balanceService.closeRefillMoneyPopup$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.openRefillBalancePopup(res);
      });

    this.balanceService.closeSendMoneyPopup$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.openSendMoneyPopup(res);
      });
  }

  public onGoBackToMain(): void {
    this.store.dispatch(new fundsAction.SetBalanceDetailsAction(null))
    this.location.back();
  }

  public onTogglePanels(panel): void {
    switch(panel){
      case 'on_confirmation':
        this.showOnConfirmation = !this.showOnConfirmation;
        break;
      case 'reserve':
        this.showReserve = !this.showReserve;
        break;
    }
  }

  public onBuyCurrency(marketPair) {
    const splitName = marketPair.split('-');
    this.dashboardWS.isNeedChangeCurretPair = false;
    this.dashboardWS.findPairByCurrencyPairName(`${splitName[0]}/${splitName[1]}`);
    this.router.navigate(['/'], {queryParams: {widget: 'trading'}});
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public get getMarketPair() {
    return (currencyName): string => {
      if (currencyName === 'BTC') {
        return 'BTC-USD';
      } else {
        return `${currencyName}-BTC`
      }
    }
  }

  public goToCryptoDepositPopup(balance: BalanceItem): void {
    this.showRefillBalancePopup = true;
    let stepName = this.utils.isFiat(balance.currencyName) ? FIAT_DEPOSIT : CRYPTO_DEPOSIT;
    this.refillBalanceData = {
      step: 2,
      stepName,
      balance,
    };
  }

  public goToCryptoWithdrawPopup(balance: BalanceItem): void {
    this.popupService.demoPopupMessage = 1;
    this.popupService.showDemoTradingPopup(true);
    // this.showSendMoneyPopup = true;
    // this.sendMoneyData = {
    //   step: 2,
    //   stepName: CRYPTO_WITHDRAWAL,
    //   balance: balance
    // };
  }

  public goToTransferPopup(balance: BalanceItem): void {
    this.popupService.demoPopupMessage = 1;
    this.popupService.showDemoTradingPopup(true);
    // this.showSendMoneyPopup = true;
    // this.sendMoneyData = {
    //   step: 2,
    //   stepName: INNER_TRANSFER,
    //   stepThreeData: balance
    // };
  }

  public openRefillBalancePopup(flag: boolean) {
    this.refillBalanceData = {};
    this.showRefillBalancePopup = flag;
  }

  public openSendMoneyPopup(flag: boolean) {
    this.sendMoneyData = {};
    this.showSendMoneyPopup = flag;
  }

}
