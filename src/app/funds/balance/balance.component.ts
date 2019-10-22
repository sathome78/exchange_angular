import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fundsReducer from '../store/reducers/funds.reducer';
import * as fundsAction from '../store/actions/funds.actions';
import * as coreAction from '../../core/actions/core.actions';
import { BalanceItem } from '../models/balance-item.model';
import { PendingRequestsItem } from '../models/pending-requests-item.model';
import { MyBalanceItem } from '../../model/my-balance-item.model';
import { BalanceService } from '../services/balance.service';
import { takeUntil, first } from 'rxjs/operators';
import {
  CRYPTO_DEPOSIT,
  CRYPTO_WITHDRAWAL,
  FIAT_DEPOSIT,
  FIAT_WITHDRAWAL,
  INNER_TRANSFER
} from './send-money/send-money-constants';
import { CurrencyChoose } from '../../model/currency-choose.model';
import * as fromCore from '../../core/reducers';
import { DashboardWebSocketService } from '../../dashboard/dashboard-websocket.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { BreakpointService } from 'app/shared/services/breakpoint.service';
import { KYC_STATUS, PENDING } from '../../shared/constants';
import { environment } from 'environments/environment';
import { IEOServiceService } from 'app/shared/services/ieoservice.service';
import { IEOItem } from 'app/model/ieo.model';
import { BALANCE_TABS, EUR } from './balance-constants';
import { DetailedCurrencyPair } from '../../model/detailed-currency-pair';
import { UserService } from 'app/shared/services/user.service';
import { UtilsService } from 'app/shared/services/utils.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
})
export class BalanceComponent implements OnInit, OnDestroy {
  /** */

  public startAnimation = false;

  public Tab = BALANCE_TABS;

  public balanceItems: BalanceItem[] = [];
  public currTab: string = this.Tab.CRYPTO;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public showRefillBalancePopup = false;
  public showSendMoneyPopup = false;
  public showQuberaPopup = false;
  public hideAllZero = false;
  public existQuberaAccounts: string = PENDING;
  public showContent: boolean = environment.showContent;
  public userInfo: ParsedToken;
  public email: string;
  private token: any;
  // public isInternalUser: boolean;

  public cryptoBalances$: Observable<BalanceItem[]>;
  public quberaBalances$: Observable<any[]>;
  public countOfCryptoEntries$: Observable<number>;
  public fiatBalances$: Observable<BalanceItem[]>;
  public countOfFiatEntries$: Observable<number>;
  public pendingRequests$: Observable<PendingRequestsItem[]>;
  public countOfPendingRequests$: Observable<number>;
  public myBalances$: Observable<MyBalanceItem>;
  public cryptoCurrenciesForChoose$: Observable<CurrencyChoose[]>;
  public fiatCurrenciesForChoose$: Observable<CurrencyChoose[]>;
  public allCurrenciesForChoose$: Observable<CurrencyChoose[]>;
  public cryptoCurrenciesForChoose: CurrencyChoose[] = [];
  public fiatCurrenciesForChoose: CurrencyChoose[] = [];
  public detailedCurrencyPairs$: Observable<DetailedCurrencyPair[]>;
  public loading$: Observable<boolean>;
  public currValue = '';
  public kycStatus = '';
  public quberaKycStatus$: Observable<string>;

  public IEOData: IEOItem[] = [];
  public sendMoneyData = {};
  public quberaData = {};
  public refillBalanceData = {};
  public currencyForChoose: string = null;
  public currentPage = 1;
  public countPerPage = 15;
  public filtering = false;

  constructor(
    public balanceService: BalanceService,
    private store: Store<fromCore.State>,
    private userService: UserService,
    private dashboardWS: DashboardWebSocketService,
    public breakpointService: BreakpointService,
    public ieoService: IEOServiceService,
    public utilsService: UtilsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.cryptoBalances$ = store.pipe(select(fundsReducer.getCryptoBalancesSelector));
    this.countOfCryptoEntries$ = store.pipe(select(fundsReducer.getCountCryptoBalSelector));
    this.fiatBalances$ = store.pipe(select(fundsReducer.getFiatBalancesSelector));
    this.countOfFiatEntries$ = store.pipe(select(fundsReducer.getCountFiatBalSelector));
    this.pendingRequests$ = store.pipe(select(fundsReducer.getPendingRequestsSelector));
    this.countOfPendingRequests$ = store.pipe(select(fundsReducer.getCountPendingReqSelector));
    this.myBalances$ = store.pipe(select(fundsReducer.getMyBalancesSelector));
    this.cryptoCurrenciesForChoose$ = store.pipe(select(fromCore.getCryptoCurrenciesForChoose));
    this.fiatCurrenciesForChoose$ = store.pipe(select(fromCore.getFiatCurrenciesForChoose));
    this.allCurrenciesForChoose$ = store.pipe(select(fromCore.getAllCurrenciesForChoose));
    this.loading$ = store.pipe(select(fundsReducer.getLoadingSelector));
    this.detailedCurrencyPairs$ = store.pipe(select(fromCore.getDetailedCurrencyPairsSelector));
    this.quberaBalances$ = this.store.pipe(select(fundsReducer.getQuberaBalancesSelector));
    this.quberaKycStatus$ = this.store.pipe(select(fundsReducer.getQuberaKycStatusSelector));

    this.cryptoCurrenciesForChoose$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currs => (this.cryptoCurrenciesForChoose = currs));
    this.fiatCurrenciesForChoose$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currs => (this.fiatCurrenciesForChoose = currs));
    this.store
      .pipe(select(fromCore.getUserInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userInfo: ParsedToken) => {
        this.userInfo = userInfo;
        if (this.userInfo && this.userInfo.publicId) {
          this.getIEOTable(this.userInfo.publicId);
        } else {
          console.error('publicId = ', this.userInfo && this.userInfo.publicId);
        }
      });
  }

  getTableAndKYCStatus() {
    this.store.dispatch(new fundsAction.LoadQuberaBalAction());
    this.store.dispatch(new fundsAction.LoadQuberaKycStatusAction());
  }

  ngOnInit() {

    setTimeout(()=>{
      this.startAnimation = true;
    },1000)

    this.store.dispatch(new fundsAction.SetIEOBalancesAction([]));
    this.store.dispatch(new fundsAction.LoadQuberaKycStatusAction());
    if (this.isMobile) {
      this.countPerPage = 30;
    }

    this.currTab = this.setCurrTab(this.route.snapshot.queryParamMap.get('tab'));
    this.hideAllZero = this.setHideZero(this.route.snapshot.queryParamMap.get('hz'));

    this.store.dispatch(new coreAction.LoadAllCurrenciesForChoose());
    this.store.dispatch(new coreAction.LoadCryptoCurrenciesForChoose());
    this.store.dispatch(new coreAction.LoadFiatCurrenciesForChoose());
    this.store.dispatch(new fundsAction.LoadMyBalancesAction());
    this.store.dispatch(new fundsAction.LoadQuberaBalAction());
    this.loadBalances(this.currTab);
    this.loadBalances(this.Tab.PR);

    this.balanceService.closeRefillMoneyPopup$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.openRefillBalancePopup(res);
    });

    this.store
      .pipe(select(fundsReducer.getBalanceStatus))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(status => {
        this.kycStatus = status;
        if (this.kycStatus === KYC_STATUS.SUCCESS) {
          // todo:
          // CHECK IF EXIST QUBERA ACCOUNT by  /api/private/v2/merchants/qubera/account/check/:currencyName
          this.existQuberaAccounts = null;
          // IF EXIST ACCOUNT LOAD QUBERA BALANCE dispatch loadQuberaBal
          // this.store.dispatch(new fundsAction.LoadQuberaBalAction());
        } else {
          this.existQuberaAccounts = null;
        }
      });

    this.store
      .pipe(select(fundsReducer.getIEOBalancesSelector))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: IEOItem[]) => {
        this.IEOData = data;
      });

    this.balanceService.closeSendMoneyPopup$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.openSendMoneyPopup(res);
    });
    this.balanceService.closeSendQuberaPopup$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.openQuberaPopup(res);
    });
    this.getUserInfo();
    this.checkEmail(this.email);
  }

  private setCurrTab(tab: string): string {
    switch (tab) {
      case 'ieo':
        return this.Tab.IEO;
      case 'fiat':
        return this.Tab.FIAT;
      case 'pr':
        return this.Tab.PR;
      case 'fw':
        return this.Tab.QUBERA;
      default:
        return this.Tab.CRYPTO;
    }
  }
  private setHideZero(val: string): boolean {
    return val === 'true';
  }

  public get isMobile(): boolean {
    return window.innerWidth <= 1200;
  }

  public onSelectTab(tab: string): void {
    this.currTab = tab;
    this.changingQueryParams('tab', tab);
    this.currentPage = 1;
    this.currValue = '';
    this.currencyForChoose = null;
    this.loadBalances(this.currTab);
  }

  public changingQueryParams(key: 'tab' | 'hz', value: string) {
    const queryParams: Params = { [key]: value.toLocaleLowerCase() };
    this.router.navigate(
      [],
      {
        queryParams,
        relativeTo: this.route,
        queryParamsHandling: 'merge',
      });
  }

  public onPageChanged({ currentPage, countPerPage }): void {
    this.countPerPage = countPerPage;
    this.currentPage = currentPage;
    this.loadBalances(this.currTab);
  }

  public loadBalances(type: string, concat?: boolean) {
    switch (type) {
      case this.Tab.CRYPTO:
        const paramsC = {
          type,
          currencyId: this.currencyForChoose || 0,
          currencyName: this.currValue || '',
          offset: (this.currentPage - 1) * this.countPerPage,
          limit: this.countPerPage,
          excludeZero: this.filtering ? !this.filtering : this.hideAllZero,
          concat: concat || false,
        };
        return this.store.dispatch(new fundsAction.LoadCryptoBalAction(paramsC));
      case this.Tab.FIAT:
        const paramsF = {
          type,
          currencyId: this.currencyForChoose || 0,
          currencyName: this.currValue || '',
          offset: (this.currentPage - 1) * this.countPerPage,
          limit: this.countPerPage,
          excludeZero: this.filtering ? !this.filtering : this.hideAllZero,
          concat: concat || false,
        };
        return this.store.dispatch(new fundsAction.LoadFiatBalAction(paramsF));
      case this.Tab.PR:
        const paramsP = {
          currencyName: this.currencyForChoose || '',
          offset: (this.currentPage - 1) * this.countPerPage,
          limit: this.countPerPage,
          concat: concat || false,
        };
        return this.store.dispatch(new fundsAction.LoadPendingReqAction(paramsP));
      case this.Tab.QUBERA:
        const paramsQ = {
          currencyName: this.currencyForChoose || '',
          offset: (this.currentPage - 1) * this.countPerPage,
          limit: this.countPerPage,
          concat: concat || false,
        };
        return this.store.dispatch(new fundsAction.LoadQuberaBalAction(paramsQ));
    }
  }

  public getCountOfEntries() {
    switch (this.currTab) {
      case this.Tab.CRYPTO:
        return this.countOfCryptoEntries$;
      case this.Tab.FIAT:
        return this.countOfFiatEntries$;
      case this.Tab.PR:
        return this.countOfPendingRequests$;
      case this.Tab.IEO:
        return of(0);
      default:
        return this.countOfCryptoEntries$;
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public openRefillBalancePopup(flag: boolean) {
    this.refillBalanceData = {};
    this.showRefillBalancePopup = flag;
  }

  public onSearchCoin(e) {
    this.currencyForChoose = e;
    this.loadBalances(this.currTab);
  }

  public openSendMoneyPopup(flag: boolean) {
    this.sendMoneyData = {};
    this.showSendMoneyPopup = flag;
  }

  public openQuberaPopup(flag: boolean) {
    this.quberaData = {};
    this.showQuberaPopup = flag;
  }

  public onToggleAllZero(): void {
    this.currentPage = 1;
    this.loadBalances(this.currTab);
    this.changingQueryParams('hz', this.hideAllZero.toString());
  }
  public onToggleAllZeroMobile(hideAllZero: boolean): void {
    this.currentPage = 1;
    this.hideAllZero = hideAllZero;
    this.loadBalances(this.currTab);
  }

  public goToCryptoWithdrawPopup(balance: BalanceItem): void {
    // this.popupService.demoPopupMessage = 1;
    // this.popupService.showDemoTradingPopup(true);
    this.showSendMoneyPopup = true;
    this.sendMoneyData = {
      balance,
      step: 2,
      stepName: this.currTab === 'CRYPTO' ? CRYPTO_WITHDRAWAL : FIAT_WITHDRAWAL,
    };
  }

  public goToCryptoDepositPopup(balance: BalanceItem): void {
    this.showRefillBalancePopup = true;
    this.refillBalanceData = {
      balance,
      step: 2,
      stepName: this.currTab === 'CRYPTO' ? CRYPTO_DEPOSIT : FIAT_DEPOSIT,
    };
  }

  public filterByCurrencyForMobile(currency): void {
    this.currencyForChoose = currency;
    this.currentPage = 1;
    this.loadBalances(this.currTab);
  }

  public goToTransferQuberaPopup(balance: BalanceItem): void {
    this.showQuberaPopup = true;
    this.quberaData = {
      balance,
      component: 'TRANSFER',
    };
  }

  public goToQuberaWithdrawPopup(balance: BalanceItem): void {
    this.balanceService
      .getCurrencyData(EUR)
      .pipe(first())
      .subscribe((data: any) => {
        this.showQuberaPopup = true;
        this.quberaData = {
          component: 'WITHDRAW',
          balance: data,
        };
      });
  }

  public goToQuberaDepositPopup(balance: BalanceItem): void {
    this.balanceService
      .getCurrencyData(EUR)
      .pipe(first())
      .subscribe((data: any) => {
        this.showQuberaPopup = true;
        this.quberaData = {
          component: 'DEPOSIT',
          balance: data,
        };
      });
  }

  public goToQuberaKYCPopup(balance: BalanceItem): void {
    this.showQuberaPopup = true;
    this.quberaData = {
      balance,
      component: 'QUBERAKYC',
    };
  }

  public goToCreateQuberaAccountPopup(balance: BalanceItem): void {
    this.showQuberaPopup = true;
    this.quberaData = {
      balance,
      component: 'CREATEQUBERA',
    };
  }

  public goToTransferPopup(balance: BalanceItem): void {
    // this.popupService.demoPopupMessage = 1;
    // this.popupService.showDemoTradingPopup(true);
    this.showSendMoneyPopup = true;
    this.sendMoneyData = {
      step: 2,
      stepName: INNER_TRANSFER,
      stepThreeData: balance,
    };
  }

  public loadMoreBalancesForMobile({ currentPage, countPerPage, concat }): void {
    this.countPerPage = countPerPage;
    this.currentPage = currentPage;
    this.loadBalances(this.currTab, concat);
  }

  public onBuyCurrency(marketPair) {
    const splitName = marketPair.split('-');
    this.dashboardWS.findPairByCurrencyPairName(`${splitName[0]}/${splitName[1]}`);
    this.router.navigate(['/'], { queryParams: { widget: 'trading' } });
  }

  public onRevokePendingRequest({ requestId, operation }): void {
    this.currentPage = 1;
    const params = {
      revoke: {
        requestId,
        operation,
      },
      loadPR: {
        offset: (this.currentPage - 1) * this.countPerPage,
        limit: this.countPerPage,
        concat: false,
      },
    };
    this.store.dispatch(new fundsAction.RevokePendingReqAction(params));
  }

  public onGoToBalanceDetails({ currencyId, priceIn }) {
    this.router.navigate([`/funds/balances/${currencyId}`], {
      queryParams: { priceIn },
    });
  }

  public onGoToQuberaDetails({ currencyCode }) {
    this.router.navigate([`/funds/balances/fiat/${currencyCode}`]);
  }

  public onGoToIEOBalanceDetails({ currencyId, priceIn }) {
    this.router.navigate([`/funds/balances/ieo/${currencyId}`], { queryParams: { priceIn } });
  }

  public onChangeCurrPair(val: string): void {
    this.currValue = val;
    this.currencyForChoose = null;
  }

  public onSelectPair(currId: string): void {
    setTimeout(() => {
      this.filtering = currId !== null;
    });
    this.currencyForChoose = currId;
    this.currentPage = 1;
    this.loadBalances(this.currTab);
  }

  public get getCryptoDynamicIData(): DIOptions[] {
    return this.cryptoCurrenciesForChoose.map(item => ({
      text: `${item.name}; ${item.description}`,
      id: item.id,
    }));
  }
  public get getFiatDynamicIData(): DIOptions[] {
    return this.fiatCurrenciesForChoose.map(item => ({
      text: `${item.name}; ${item.description}`,
      id: item.id,
    }));
  }

  public getIEOTable(publicId) {
    this.ieoService
      .getListIEOTab(publicId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: IEOItem[]) => {
        this.store.dispatch(new fundsAction.SetIEOBalancesAction(res));
      });
  }

  private getUserInfo() {
    this.store
      .pipe(
        first(),
        select(fromCore.getUserInfo)
      )
      .subscribe(data => {
        this.email = data.username;
        this.token = data.token_id;
        // delete after tests
        // this.isInternalUser = this.email.split('@')[1] === 'upholding.biz';
      });
  }

  checkEmail(email: string) {
    // this.userService.getCheckTo2FAEnabled(email)
    // .pipe(first())
    // .subscribe(data => {
    // });
  }
}
