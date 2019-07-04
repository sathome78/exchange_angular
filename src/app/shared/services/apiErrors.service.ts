import {Injectable} from '@angular/core';
import {APIError} from '../models/apiError.model';
import {catchError} from 'rxjs/operators';
import {of, throwError} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {TopNotificationReportComponent} from 'app/popups/notifications-list/top-notification-report/top-notification-report.component';
import {Notification} from 'app/model/notification.model';

@Injectable()
export class APIErrorsService {
  private toastOption;

  constructor(
    private toastr: ToastrService,
  ) {
    this.toastOption = this.toastr.toastrConfig;
  }

  extractErrorCode(error: APIError): string {
    if (!error) {
      return null;
    }
    if (error.detail) {
      const text = error.detail;
      if (error.args && error.args.length) {
        error.args.forEach((err, i) => {
          text.replace('&{' + i + '}', err);
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

  catchAPIErrorWithNotification() {

    return catchError((error) => {
      const err = this.parseErrorCode(this.extractErrorCode(error.error));
      const {status, url} = error;
      if (status !== 400) {
        this.showErrorNotification(new Notification({notificationType: 'ERROR', text: err}));
      }
      console.log(err);
      return throwError(error);
    });
  }


  showErrorNotification(notification: Notification): void {
    this.toastOption.toastComponent = TopNotificationReportComponent;
    this.toastOption.disableTimeOut = true;
    this.toastOption.tapToDismiss = false;
    const tost = this.toastr.show(notification.message, notification.title, this.toastOption);
    tost.onAction.subscribe((res) => {
      console.log('alert');
    });
  }

}

// error:
  // cause: "IncorrectPinException"
  // code: null
  // detail: "Incorrect pin: adasdfasdf"
  // title: null
  // url: "http://dev1.exrates.tech/api/private/v2/balances/withdraw/request/create"
  // uuid: "a21f92d1-225c-4ffc-aaf6-3d6e6042e0c3"
  // __proto__: Object
// headers: HttpHeaders {normalizedNames: Map(0), lazyUpdate: null, lazyInit: ƒ}
// message: "Http failure response for http://dev1.exrates.tech/api/private/v2/balances/withdraw/request/create: 400 Bad Request"
// name: "HttpErrorResponse"
// ok: false
// status: 400
// statusText: "Bad Request"
// url: "http://dev1.e
