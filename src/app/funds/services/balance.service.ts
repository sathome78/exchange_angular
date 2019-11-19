import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BalanceItem } from '../models/balance-item.model';
import { MyBalanceItem } from '../../model/my-balance-item.model';
import { PendingRequestsItem } from '../models/pending-requests-item.model';
import { APIErrorsService } from 'app/shared/services/apiErrors.service';
import { map } from 'rxjs/operators';
import { TransferMerchantResponse } from '../models/transfer-models.model';

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

  constructor(private http: HttpClient, private apiErrorsService: APIErrorsService) {}

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

  // request to get balances
  getBalances({
    type,
    currencyId,
    currencyName,
    offset,
    limit,
    excludeZero,
  }): Observable<ResponseModel<BalanceItem[]>> {
    const params = {
      currencyId,
      currencyType: type,
      currencyName: currencyName || '',
      offset: offset + '',
      limit: limit + '',
      excludeZero: currencyName ? 'false' : (!!excludeZero).toString(),
    };
    return this.http.get<ResponseModel<BalanceItem[]>>(`${this.apiUrl}/api/private/v2/balances`, { params });
  }

  // request to get balance of certain currency
  getBalanceByName(currencyId, currencyType): Observable<BalanceItem> {
    const params = {
      currencyId,
      currencyType,
      currencyName: '',
      offset: '0',
      limit: '1',
      excludeZero: 'false',
    };
    return this.http.get<ResponseModel<BalanceItem>>(`${this.apiUrl}/api/private/v2/balances`, { params })
      .pipe(map(i => i.items[0]));
  }

  // request to get balances
  getPendingRequests({ offset, limit, currencyName }): Observable<ResponseModel<PendingRequestsItem[]>> {
    const params = {
      offset: offset + '',
      limit: limit + '',
      currencyName: currencyName || '',
    };
    return this.http.get<ResponseModel<PendingRequestsItem[]>>(
      `${this.apiUrl}/api/private/v2/balances/pendingRequests`,
      { params }
    );
  }

  getBalanceItems(): Observable<BalanceItem[]> {
    const url = this.apiUrl + '/api/private/v2/balances/';
    return this.http.get<BalanceItem[]>(url);
  }

  getCurrencyRefillData(cryptoName: string) {
    const httpOptions = {
      params: new HttpParams().set('currency', cryptoName),
    };
    const url = `${this.apiUrl}/api/private/v2/balances/refill/merchants/input`;
    return this.http.get<string[]>(url, httpOptions);
  }

  getQuberaBalancesInfo() {
    const url = `${this.apiUrl}/api/private/v2/merchants/qubera/account/info`;
    return this.http.get(url);
  }

  getCurrencyData(cryptoName: string) {
    const httpOptions: any = {
      params: new HttpParams().set('currency', cryptoName),
      observe: 'response',
    };
    const url = `${this.apiUrl}/api/private/v2/balances/withdraw/merchants/output`;
    return this.http.get<string[]>(url, httpOptions).pipe(this.apiErrorsService.catchAPIErrorWithNotification());
  }

  refill(data) {
    const url = `${this.apiUrl}/api/private/v2/balances/refill/request/create`;
    return this.http
      .post(url, data, { observe: 'response' })
      .pipe(this.apiErrorsService.catchAPIErrorWithNotification());
  }

  // getCommissionToWithdraw(amount: string, currency: string, merchant: string) {
  //   let httpOptions = new HttpParams();
  //   httpOptions = httpOptions.append('amount', amount);
  //   httpOptions = httpOptions.append('currency', currency);
  //   httpOptions = httpOptions.append('merchant', merchant);

  //   const url = `${this.apiUrl}/api/private/v2/balances/withdraw/commission`;
  //   return this.http
  //     .get(url, { params: httpOptions, observe: 'response' })
  //     .pipe(this.apiErrorsService.catchAPIErrorWithNotification());
  // }

  sendTransferCode(code: string) {
    const data = { CODE: code };
    const url = `${this.apiUrl}/api/private/v2/balances/transfer/accept`;
    return this.http
      .post(url, data, { observe: 'response' })
      .pipe(this.apiErrorsService.catchAPIErrorWithNotification());
  }

  sendWithdrawalPinCode(data) {
    const url = `${this.apiUrl}/api/private/v2/balances/withdraw/request/pin`;
    return this.http
      .post(url, data, { observe: 'response' })
      .pipe(this.apiErrorsService.catchAPIErrorWithNotificationRes());
  }

  sendTransferPinCode(data) {
    const url = `${this.apiUrl}/api/private/v2/balances/transfer/request/pin`;
    return this.http
      .post(url, data, { observe: 'response' })
      .pipe(this.apiErrorsService.catchAPIErrorWithNotificationRes());
  }

  withdrawRequest(data) {
    const url = `${this.apiUrl}/api/private/v2/balances/withdraw/request/create`;
    return this.http
      .post(url, data, { observe: 'response' })
      .pipe(this.apiErrorsService.catchAPIErrorWithNotification());
  }

  getMyBalances(): Observable<MyBalanceItem> {
    return this.http.get<MyBalanceItem>(this.apiUrl + '/api/private/v2/balances/myBalances');
  }

  getCommisionInfo(currency: string, amount: string, ty: string) {
    let httpOptions = new HttpParams();
    httpOptions = httpOptions.append('currency', currency);
    httpOptions = httpOptions.append('amount', amount);
    httpOptions = httpOptions.append('type', ty);

    const url = `${this.apiUrl}/api/private/v2/balances/transfer/voucher/commission`;
    return this.http
      .get(url, { params: httpOptions, observe: 'response' })
      .pipe(this.apiErrorsService.catchAPIErrorWithNotification(true));
  }

  checkEmail(email: string) {
    const encodedEmail = encodeURIComponent(email);
    const httpOptions: any = {
      params: new HttpParams().set('email', encodedEmail),
      observe: 'response',
    };
    const url = `${this.apiUrl}/api/private/v2/balances/transfer/check_email`;
    return this.http.get(url, httpOptions).pipe(this.apiErrorsService.catchAPIErrorWithNotification(true));
  }

  getMinSumInnerTranfer(currency_id: string, type: string) {
    let httpOptions = new HttpParams();
    httpOptions = httpOptions.append('currency_id', currency_id);
    httpOptions = httpOptions.append('type', type);

    const url = `${this.apiUrl}/api/private/v2/balances/transfer/get_minimal_sum`;
    return this.http
      .get(url, { params: httpOptions, observe: 'response' })
      .pipe(this.apiErrorsService.catchAPIErrorWithNotification(true));
  }

  createTransferInstant(data) {
    const url = `${this.apiUrl}/api/private/v2/balances/transfer/voucher/request/create`;
    return this.http
      .post(url, data, { observe: 'response' })
      .pipe(this.apiErrorsService.catchAPIErrorWithNotification(true));
  }

  revokePendingRequest({ requestId, operation }) {
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
    return this.http
      .post(`${this.apiUrl}/api/private/v2/kyc/start`, body, { observe: 'response' })
      .pipe(this.apiErrorsService.catchAPIErrorWithNotification(true));
  }

  getStatusKYC() {
    return this.http.get(`${this.apiUrl}/api/private/v2/merchants/qubera/verification_status`);
  }

  checkQuberaAccount(currency: string) {
    return this.http.get(`${this.apiUrl}/api/private/v2/merchants/qubera/account/check/${currency}`);
  }

  sendCodeToMail() {
    return this.http
      .post(`${this.apiUrl}/api/private/v2/merchants/qubera/request/pin`, {}, { observe: 'response' })
      .pipe(this.apiErrorsService.catchAPIErrorWithNotification(true));
  }

  createQuberaAccount(body: any) {
    return this.http
      .post(`${this.apiUrl}/api/private/v2/merchants/qubera/account/create`, body, { observe: 'response' })
      .pipe(this.apiErrorsService.catchAPIErrorWithNotification(true));
  }

  getBankInfo() {
    return this.http.get(`${this.apiUrl}/api/private/v2/merchants/qubera/info`);
  }

  sendWithdraw(body: any) {
    return this.http
      .post(`${this.apiUrl}/api/private/v2/merchants/qubera/payment/external`, body, { observe: 'response' })
      .pipe(this.apiErrorsService.catchAPIErrorWithNotification(true));
  }

  confirmSendWithdraw(body: any) {
    return this.http
      .post(`${this.apiUrl}/api/private/v2/merchants/qubera/info`, body, { observe: 'response' })
      .pipe(this.apiErrorsService.catchAPIErrorWithNotification(true));
  }

  fiatDepositQubera(body: any) {
    return this.http
      .post(`${this.apiUrl}/api/private/v2/balances/transfer/request/pin`, body, { observe: 'response' })
      .pipe(this.apiErrorsService.catchAPIErrorWithNotification(true));
  }

  downloadQuberaInvoice(url) {
    return this.http.get(`${url}`, { responseType: 'blob' });
  }

  getTransferMerchants(currencyName: string): Observable<TransferMerchantResponse> {
    const params = {
      currency: currencyName,
    };
    const mock = {
      merchantCurrencies: [
        {
          merchantId: 30,
          currencyId: 4,
          name: 'SimpleTransfer',
          processType: 'TRANSFER',
          minInputSum: 0.00165,
          minOutputSum: 0.00165,
          minTransferSum: 0.00165,
          inputCommission: 0,
          outputCommission: 0,
          transferCommission: 0.2,
          minFixedCommission: 0,
          listMerchantImage: [
            {
              id: 85,
              imagePath: '/client/img/merchants/transfer.png',
            },
          ],
          withdrawBlocked: true,
          refillBlocked: true,
          transferBlocked: false,
        },
        {
          merchantId: 31,
          currencyId: 4,
          name: 'VoucherTransfer',
          processType: 'TRANSFER',
          minInputSum: 0.00165,
          minOutputSum: 0.00165,
          minTransferSum: 0.00165,
          inputCommission: 0,
          outputCommission: 0,
          transferCommission: 0.2,
          minFixedCommission: 0,
          listMerchantImage: [
            {
              id: 106,
              imagePath: '/client/img/merchants/voucher.png',
            },
          ],
          withdrawBlocked: true,
          refillBlocked: true,
          transferBlocked: false,
        },
        {
          merchantId: 32,
          currencyId: 4,
          name: 'VoucherFreeTransfer',
          processType: 'TRANSFER',
          minInputSum: 0.00165,
          minOutputSum: 0.00165,
          minTransferSum: 0.00165,
          inputCommission: 0,
          outputCommission: 0,
          transferCommission: 0.2,
          minFixedCommission: 0,
          listMerchantImage: [
            {
              id: 127,
              imagePath: '/client/img/merchants/voucher_free.png',
            },
          ],
          withdrawBlocked: true,
          refillBlocked: true,
          transferBlocked: false,
        },
      ],
      operationRestrictedToUser: false,
    };
    const mock2 = {
      merchantCurrencies: [
        {
          merchantId: 30,
          currencyId: 4,
          name: 'SimpleTransfer',
          processType: 'TRANSFER',
          minInputSum: 0.00165,
          minOutputSum: 0.00165,
          minTransferSum: 0.1,
          inputCommission: 0,
          outputCommission: 0,
          transferCommission: 0.2,
          minFixedCommission: 0,
          listMerchantImage: [
            {
              id: 85,
              imagePath: '/client/img/merchants/transfer.png',
            },
          ],
          withdrawBlocked: true,
          refillBlocked: true,
          transferBlocked: false,
        },
        {
          merchantId: 31,
          currencyId: 4,
          name: 'VoucherTransfer',
          processType: 'TRANSFER',
          minInputSum: 0.00165,
          minOutputSum: 0.00165,
          minTransferSum: 0.1,
          inputCommission: 0,
          outputCommission: 0,
          transferCommission: 0.2,
          minFixedCommission: 0,
          listMerchantImage: [
            {
              id: 106,
              imagePath: '/client/img/merchants/voucher.png',
            },
          ],
          withdrawBlocked: true,
          refillBlocked: true,
          transferBlocked: false,
        },
        {
          merchantId: 32,
          currencyId: 4,
          name: 'VoucherFreeTransfer',
          processType: 'TRANSFER',
          minInputSum: 0.00165,
          minOutputSum: 0.00165,
          minTransferSum: 0.1,
          inputCommission: 0,
          outputCommission: 0,
          transferCommission: 0.2,
          minFixedCommission: 0,
          listMerchantImage: [
            {
              id: 127,
              imagePath: '/client/img/merchants/voucher_free.png',
            },
          ],
          withdrawBlocked: true,
          refillBlocked: true,
          transferBlocked: false,
        },
      ],
      operationRestrictedToUser: false,
    };
    // return this.http
    //   .get<TransferMerchantResponse>(`${this.apiUrl}/api/private/v2/balances/transfer/merchants`, { params });

    if (currencyName === 'BTC') {
      return of(mock);
    }
    return of(mock2);
  }
}
