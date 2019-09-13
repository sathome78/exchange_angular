import { Injectable } from '@angular/core';
import { APIError } from '../models/apiError.model';
import { catchError, map } from 'rxjs/operators';
import { throwError, pipe } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TopNotificationReportComponent } from 'app/popups/notifications-list/top-notification-report/top-notification-report.component';
import { Notification } from 'app/model/notification.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Store, select } from '@ngrx/store';
import * as fromCore from 'app/core/reducers';
import { APIErrorReport } from '../models/apiErrorReport.model';
import { TopNotificationComponent } from 'app/popups/notifications-list/top-notification/top-notification.component';
import { UtilsService } from './utils.service';

@Injectable()
export class APIErrorsService {
  private toastOption;
  private apiUrl = environment.apiUrl;
  public userInfo: ParsedToken;

  constructor(
    private toastr: ToastrService,
    private store: Store<fromCore.State>,
    private http: HttpClient,
    private utilsService: UtilsService
  ) {
    this.toastOption = this.toastr.toastrConfig;
    this.store.pipe(select(fromCore.getUserInfo)).subscribe((res: ParsedToken) => {
      this.userInfo = res;
    });
  }

  extractErrorCode(error: APIError): string {
    if (!error) {
      return null;
    }
    if (error.detail) {
      const text = error.detail;
      if (error.args && error.args.length) {
        error.args.forEach((err, i) => {
          text.replace(`&{${i}}`, err);
        });
      }
      return text;
    }
    if (error.title) {
      return error.title;
    }
    if (error.cause) {
      return error.cause;
    }
    return JSON.stringify(error);
  }

  parseErrorCode(code: string) {
    switch (code) {
      case 'error.invalid_amount':
        return 'Invalid amount';
      case 'merchant.operationNotAvailable':
        return 'Unfortunately, the operation is not available at the moment';
      case 'merchants.OutputRequestsLimit':
        return 'Your daily output limit for this currency has been exceeded. Please try again tomorrow.';
      case 'message.pin_code.incorrect':
        return 'Pin-code wrong';
      case 'message.limits_exceed':
        return 'Your limit for accepting code exceed';
      case 'message.error_accept_by_current_code':
        return 'Error accept transfer by current code';
      case 'error.illegal_opertion_type':
        return 'Illegal operation type';
      case 'message.only.latin.symblos':
        return 'Only Latin symbols';
      case 'error.send_message_user':
        return 'Failed to send user email';

      default:
        return code;
    }
  }

  catchAPIErrorWithNotification(showReportBtn: boolean = false) {
    return pipe(
      catchError(error => {
        if (!this.utilsService.showContentProd) {
          return throwError(error);
        }
        const err = this.parseErrorCode(this.extractErrorCode(error.error));
        const { status, url, method = 'POST' } = error;
        const username = this.userInfo ? this.userInfo.username : '';
        // if (
        //   (status === 403) ||
        //   (url.indexOf('api/private/v2/dashboard/order') >= 0 && status === 406) ||
        //   (url.indexOf('api/public/v2/users/authenticate') >= 0 && status === 400)
        // ) {
        //   return throwError(error);
        // }
        if (status >= 500) {
          this.showErrorNotification(
            new Notification({ notificationType: 'ERROR', text: err }),
            new APIErrorReport(username, url, method, status, JSON.stringify(error.error)),
            showReportBtn
          );
        }
        // console.log(err);
        return throwError(error);
      }),
      map((res: HttpResponse<any>) => res.body)
    );
  }
  catchAPIErrorWithNotificationRes(showReportBtn: boolean = false) {
    return pipe(
      catchError(error => {
        if (!this.utilsService.showContentProd) {
          return throwError(error);
        }
        const err = this.parseErrorCode(this.extractErrorCode(error.error));
        const { status, url, method } = error;
        const username = this.userInfo ? this.userInfo.username : '';
        if (status >= 400) {
          const isReportBtn = status >= 500 || showReportBtn;
          this.showErrorNotification(
            new Notification({ notificationType: 'ERROR', text: err }),
            new APIErrorReport(username, url, method, status, JSON.stringify(error.error)),
            isReportBtn
          );
        }
        // console.log(err);
        return throwError(error);
      }),
      map((res: HttpResponse<any>) => res)
    );
  }

  showErrorNotification(notification: Notification, report: APIErrorReport, showReportBtn: boolean = false): void {
    if (showReportBtn) {
      this.toastOption.toastComponent = TopNotificationReportComponent;
    } else {
      this.toastOption.toastComponent = TopNotificationComponent;
    }
    this.toastOption.disableTimeOut = true;
    this.toastOption.tapToDismiss = false;
    const tost = this.toastr.show(notification.message, notification.title, this.toastOption);
    if (showReportBtn) {
      const sub = tost.onAction.subscribe(() => {
        this.postReport(report).subscribe(res => {
          console.log('alert', res);
        });
        sub.unsubscribe();
      });
    }
  }

  postReport(data: APIErrorReport) {
    return this.http.post(`${this.apiUrl}/api/public/v2/error_report`, data);
  }
}

// private String userEmail;
// @NotNull
// @Length(max = 200)
// private String url;
// @NotNull
// @Length(max = 20)
// private String method;
// @NotNull
// private int respStatus;
// @NotNull
// @Length(max = 1000)
// private String responseBody;

// POST /api/public/v2/error_report

// error:
// cause: "IncorrectPinException"
// code: null
// detail: "Incorrect pin: adasdfasdf"
// title: null
// url: "http://dev1.exrates.tech/api/private/v2/balances/withdraw/request/create"
// uuid: "a21f92d1-225c-4ffc-aaf6-3d6e6042e0c3"
// __proto__: Object
// headers: HttpHeaders {normalizedNames: Map(0), lazyUpdate: null, lazyInit: ƒ}
// message: "Http failure response for http://dev1.exrates.tech/api/private/v2/balances/withdraw/request/create:
// 400 Bad Request"
// name: "HttpErrorResponse"
// ok: false
// status: 400
// statusText: "Bad Request"
// url: "http://dev1.e
