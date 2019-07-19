import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable, Subject, BehaviorSubject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {BalanceItem} from '../models/balance-item.model';
import {MyBalanceItem} from '../../model/my-balance-item.model';
import {DashboardWebSocketService} from '../../dashboard/dashboard-websocket.service';
import {Router} from '@angular/router';
import {PendingRequestsItem} from '../models/pending-requests-item.model';
import { BankVerification } from 'app/model/bank-veryfication.model';
import { bankInfo } from '../models/bank-info.model';

@Injectable()
export class BalanceService {

  apiUrl = environment.apiUrl;
  public goToPinCode$ = new Subject();
  public closeRefillMoneyPopup$ = new Subject<boolean>();
  public closeSendMoneyPopup$ = new Subject<boolean>();
  public closeSendQuberaPopup$ = new Subject<boolean>();
  public goToSendMoneySuccess$ = new Subject();
  public goToSendMoneyInnerTransfer$ = new Subject();

  public refillTransfer = new BehaviorSubject<any>(null);
  public withdrawQubera = new BehaviorSubject<any>(null);

  setRefillTransfer(body: any) {
    this.refillTransfer.next(body);
  }

  getRefillTransfer(): Observable<any> {
    return this.refillTransfer.asObservable();
  }

  setWithdrawQubera(body: any) {
    this.withdrawQubera.next(body);
  }

  getWithdrawQubera(): Observable<any> {
    return this.withdrawQubera.asObservable();
  }

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

  getCurrencyRefillData(cryptoName: string) {
    const httpOptions = {
      params: new HttpParams().set('currency', cryptoName)
    };
    const url = `${this.apiUrl}/api/private/v2/balances/refill/merchants/input`;
    return this.http.get<string[]>(url, httpOptions);
  }

  getQuberaBalancesInfo() {
    const url = `${this.apiUrl}/api/private/v2/merchants/qubera/account/info`;
    return  this.http.get(url);
  }

  getCurrencyData(cryptoName: string) {
    const httpOptions = {
      params: new HttpParams().set('currency', cryptoName)
    };
    const url = `${this.apiUrl}/api/private/v2/balances/withdraw/merchants/output`;
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

  sendWithdrawalPinCode(data) {
    const url = `${this.apiUrl}/api/private/v2/balances/withdraw/request/pin`;
    return this.http.post(url, data, { observe: 'response' });
  }
  sendTransferPinCode(data) {
    const url = `${this.apiUrl}/api/private/v2/balances/transfer/request/pin`;
    return this.http.post(url, data, { observe: 'response' });
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

  getBalanceQuberaInfo() {
    return this.http.get(`${this.apiUrl}/api/private/v2/merchants/qubera/account/info`);
  }

  postFUGAccount(body: any) {
    return this.http.post(`${this.apiUrl}/api/private/v2/kyc/start`, body);
  }

  getStatusKYC() {
    return this.http.get(`${this.apiUrl}/api/private/v2/merchants/qubera/verification_status`);
  }

  checkQuberaAccount(currency: string) {
    return this.http.get(`${this.apiUrl}/api/private/v2/merchants/qubera/account/check/${currency}`);
  }

  sendCodeToMail() {
    return this.http.post(`${this.apiUrl}/api/private/v2/merchants/qubera/request/pin`, {});
  }

  createQuberaAccount(body: any) {
    return this.http.post(`${this.apiUrl}/api/private/v2/merchants/qubera/account/create`, body);
  }

  getBankInfo() {
    return this.http.get(`${this.apiUrl}/api/private/v2/merchants/qubera/info`);
  }

  sendWithdraw(body: any) {
    return this.http.post(`${this.apiUrl}/api/private/v2/merchants/qubera/payment/external`, body);
  }

  confirmSendWithdraw(body: any) {
    return this.http.post(`${this.apiUrl}/api/private/v2/merchants/qubera/info`, body);
  }

  fiatDepositQubera(body: any) {
    return this.http.post(`${this.apiUrl}/api/private/v2/balances/withdraw/request/pin`, body)
  }

}
