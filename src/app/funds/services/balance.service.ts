import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {BalanceWrapper} from '../models/balance-wrapper.model';
import {BalanceItem} from '../models/balance-item.model';
import {type} from 'os';

@Injectable()
export class BalanceService {

  apiUrl = environment.apiUrl;
  public goToPinCode$ = new Subject();
  public goToSendMoneySuccess$ = new Subject();
  public goToSendMoneyInnerTransfer$ = new Subject();

  constructor(
    private http: HttpClient
  ) {
  }

  // request to get crypto balances
  getCryptoBalances({
                      offset,
                      limit,
                      excludeZero
                    }): Observable<BalanceWrapper> {

    const params = {
      offset: offset + '',
      limit: limit + '',
      currencyType: 'CRYPTO',
      excludeZero: (!!excludeZero).toString(),
    };
    return this.http.get<BalanceWrapper>(`${this.apiUrl}/info/private/v2/balances`, {params});
  }

  getBalanceItems(): Observable<BalanceItem[]> {
    const url = this.apiUrl + '/info/private/v2/balances/';
    return this.http.get<BalanceItem[]>(url);
  }

  getCryptoNames(): Observable<any[]> {
    const url = `${this.apiUrl}/info/private/v2/balances/refill/crypto-currencies`;
    return this.http.get<string[]>(url);
  }

  getCryptoFiatNames(): Observable<{data: any[], error: any}> {
    const url = `${this.apiUrl}/info/private/v2/balances/transfer/currencies`;
    return this.http.get<{data: any[], error: any}>(url);
  }

  getFiatNames(): Observable<any[]> {
    const url = `${this.apiUrl}/info/private/v2/balances/refill/fiat-currencies`;
    return this.http.get<string[]>(url);
  }

  getCurrencyData(cryptoName: string) {
    const httpOptions = {
      params: new HttpParams().set('currency', cryptoName)
    };
    const url = `${this.apiUrl}/info/private/v2/balances/refill/merchants/input`;
    return this.http.get<string[]>(url, httpOptions);
  }

  refill(data) {
    const url = `${this.apiUrl}/info/private/v2/balances/refill/request/create`;
    return this.http.post(url, data);
  }

  getCryptoMerchants(cryptoName) {
    const httpOptions = {
      params: new HttpParams().set('currency', cryptoName)
    };
    const url = `${this.apiUrl}/info/private/v2/balances/withdraw/merchants/output`;
    return this.http.get(url, httpOptions);
  }

  sendTransferCode(code: string) {
    const data = {CODE: code};
    const url = `${this.apiUrl}/info/private/v2/balances/transfer/accept`;
    return this.http.post(url, data);
  }

  sendPinCode() {
    const url = `${this.apiUrl}/info/private/v2/balances/withdraw/request/pin`;
    return this.http.get(url);
  }

  withdrawRequest(data) {
    const url = `${this.apiUrl}/info/private/v2/balances/withdraw/request/create`;
    return this.http.post(url, data);
  }

  getTotalBalance() {
    const url = `${this.apiUrl}/info/private/v2/balances/totalBalance`;
    return this.http.get(url);
  }

  getCommisionInfo(currency: string, amount: string, ty: string) {

    let httpOptions = new HttpParams();
    httpOptions = httpOptions.append('currency', currency);
    httpOptions = httpOptions.append('amount', amount);
    httpOptions = httpOptions.append('type', ty);

    const url = `${this.apiUrl}/info/private/v2/balances/transfer/voucher/commission`;
    return this.http.get(url, {params: httpOptions});
  }

  checkEmail(email: string) {
    const httpOptions = {
      params: new HttpParams().set('email', email)
    };
    const url = `${this.apiUrl}/info/private/v2/balances/transfer/check_email`;
    return this.http.get(url, httpOptions);
  }

  getMinSumInnerTranfer(currency_id: string, typ: string) {
    let httpOptions = new HttpParams();
    httpOptions = httpOptions.append('currency_id', currency_id);
    httpOptions = httpOptions.append('type', typ);

    const url = `${this.apiUrl}/info/private/v2/balances/transfer/get_minimal_sum`;
    return this.http.get(url, {params: httpOptions});
  }

  createTransferInstant(data) {
    const url = `${this.apiUrl}/info/private/v2/balances/transfer/voucher/request/create`;
    return this.http.post(url, data);
  }
}
