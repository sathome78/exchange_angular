import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {BalanceItem} from '../models/balance-item.model';
import {MyBalanceItem} from '../../model/my-balance-item.model';
import {DashboardWebSocketService} from '../../dashboard/dashboard-websocket.service';
import {Router} from '@angular/router';
import {PendingRequestsItem} from '../models/pending-requests-item.model';

@Injectable()
export class BalanceService {

  apiUrl = environment.apiUrl;
  public goToPinCode$ = new Subject();
  public closeRefillMoneyPopup$ = new Subject<boolean>();
  public closeSendMoneyPopup$ = new Subject<boolean>();
  public goToSendMoneySuccess$ = new Subject();
  public goToSendMoneyInnerTransfer$ = new Subject();

  constructor(
    private http: HttpClient,
    private dashboardWS: DashboardWebSocketService,
    private router: Router,
  ) {
  }

  // request to get balances
  getBalances({
                type,
                currencyId,
                currencyName,
                offset,
                limit,
                excludeZero
              }): Observable<ResponseModel<BalanceItem[]>> {

    const params = {
      currencyType: type,
      currencyId,
      currencyName: currencyName || '',
      offset: offset + '',
      limit: limit + '',
      excludeZero: (!!excludeZero).toString(),
    };
    return this.http.get<ResponseModel<BalanceItem[]>>(`${this.apiUrl}/api/private/v2/balances`, {params});
  }

  // request to get balances
  getPendingRequests({offset, limit, currencyName}): Observable<ResponseModel<PendingRequestsItem[]>> {
    const params = {
      offset: offset + '',
      limit: limit + '',
      currencyName: currencyName || '',
    };
    return this.http.get<ResponseModel<PendingRequestsItem[]>>(`${this.apiUrl}/api/private/v2/balances/pendingRequests`, {params});
  }


  getBalanceItems(): Observable<BalanceItem[]> {
    const url = this.apiUrl + '/api/private/v2/balances/';
    return this.http.get<BalanceItem[]>(url);
  }

  getCurrencyData(cryptoName: string) {
    const httpOptions = {
      params: new HttpParams().set('currency', cryptoName)
    };
    const url = `${this.apiUrl}/api/private/v2/balances/refill/merchants/input`;
    return this.http.get<string[]>(url, httpOptions);
  }

  refill(data) {
    const url = `${this.apiUrl}/api/private/v2/balances/refill/request/create`;
    return this.http.post(url, data);
  }

  getCryptoMerchants(cryptoName) {
    const httpOptions = {
      params: new HttpParams().set('currency', cryptoName)
    };
    const url = `${this.apiUrl}/api/private/v2/balances/withdraw/merchants/output`;
    return this.http.get(url, httpOptions);
  }

  getCommissionToWithdraw(amount: string, currency: string, merchant: string) {
    let httpOptions = new HttpParams();
    httpOptions = httpOptions.append('amount', amount);
    httpOptions = httpOptions.append('currency', currency);
    httpOptions = httpOptions.append('merchant', merchant);

    const url = `${this.apiUrl}/api/private/v2/balances/withdraw/commission`;
    return this.http.get(url, {params: httpOptions});
  }

  sendTransferCode(code: string) {
    const data = {CODE: code};
    const url = `${this.apiUrl}/api/private/v2/balances/transfer/accept`;
    return this.http.post(url, data);
  }

  sendPinCode() {
    const url = `${this.apiUrl}/api/private/v2/balances/withdraw/request/pin`;
    return this.http.get(url);
  }

  withdrawRequest(data) {
    const url = `${this.apiUrl}/api/private/v2/balances/withdraw/request/create`;
    return this.http.post(url, data);
  }

  getMyBalances(): Observable<MyBalanceItem> {
    return this.http.get<MyBalanceItem>(this.apiUrl + '/api/private/v2/balances/myBalances');
  }

  getTotalBalance() {
    const url = `${this.apiUrl}/api/private/v2/balances/totalBalance`;
    return this.http.get(url);
  }

  getCommisionInfo(currency: string, amount: string, ty: string) {

    let httpOptions = new HttpParams();
    httpOptions = httpOptions.append('currency', currency);
    httpOptions = httpOptions.append('amount', amount);
    httpOptions = httpOptions.append('type', ty);

    const url = `${this.apiUrl}/api/private/v2/balances/transfer/voucher/commission`;
    return this.http.get(url, {params: httpOptions});
  }

  checkEmail(email: string) {
    const httpOptions = {
      params: new HttpParams().set('email', email)
    };
    const url = `${this.apiUrl}/api/private/v2/balances/transfer/check_email`;
    return this.http.get(url, httpOptions);
  }

  getMinSumInnerTranfer(currency_id: string, typ: string) {
    let httpOptions = new HttpParams();
    httpOptions = httpOptions.append('currency_id', currency_id);
    httpOptions = httpOptions.append('type', typ);

    const url = `${this.apiUrl}/api/private/v2/balances/transfer/get_minimal_sum`;
    return this.http.get(url, {params: httpOptions});
  }

  createTransferInstant(data) {
    const url = `${this.apiUrl}/api/private/v2/balances/transfer/voucher/request/create`;
    return this.http.post(url, data);
  }

  revokePendingRequest({requestId, operation}) {
    const url = `${this.apiUrl}/api/private/v2/balances/pending/revoke/${requestId}/${operation}`;
    return this.http.delete(url);
  }

  getBalanceDetailsInfo(currencyId: number) {
    const url = `${this.apiUrl}/api/private/v2/balances/currencies/${currencyId}`;
    return this.http.get(url);
  }

  getMaxCurrencyPairByName(currencyName: string) {
    const url = `${this.apiUrl}/api/public/v2/info/max/${currencyName}`;
    return this.http.get(url);
  }

  goToTrade(balance: BalanceItem): void {
    this.dashboardWS.isNeedChangeCurretPair = false;
    this.dashboardWS.choosePairForTrade(balance.currencyName);
    this.router.navigate(['/']);
  }

}
