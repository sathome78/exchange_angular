import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {
  private transactionsHistoryStatuses = {
    WITHDRAW: {
      REVOKED_USER: {
        backendStatus: 'REVOKED_USER',
        description: 'Отмена заявки на вывод юзером',
        operationType: 'Withdraw',
        status: 'Canceled',
      },
      DECLINED_ADMIN: {
        backendStatus: 'DECLINED_ADMIN',
        description: 'Отмена заявки на вывод админом',
        operationType: 'Withdraw',
        status: 'Declined',
      },
      POSTED_MANUAL: {
        backendStatus: 'POSTED_MANUAL',
        description: 'Вывели вручную',
        operationType: 'Withdraw',
        status: 'Completed',
      },
      POSTED_AUTO: {
        backendStatus: 'POSTED_AUTO',
        description: 'Успешный автовывод',
        operationType: 'Withdraw',
        status: 'Completed',
      },
      DECLINED_ERROR: {
        backendStatus: 'DECLINED_ERROR',
        description: 'Неуспешный автовывод',
        operationType: 'Withdraw',
        status: 'Declined',
      },
    },

    USER_TRANSFER: {
      POSTED: {
        backendStatus: 'POSTED',
        description: 'Получил трансфер, принял ваучер',
        operationType: 'Transfer / Voucher / Voucher free',
        status: 'Completed',
      },
      REVOKED: {
        backendStatus: 'REVOKED',
        description: 'Юзер отменил трансфер до момента принятия его другим юзером',
        operationType: 'Transfer / Voucher / Voucher free',
        status: 'Canceled',
      },
      REVOKED_ADMIN: {
        backendStatus: 'REVOKED_ADMIN',
        description: 'Админ отменил трансфер до момента принятия его юзером',
        operationType: 'Transfer / Voucher / Voucher free',
        status: 'Declined',
      },
    },
    REFILL: {
      DECLINED_ADMIN: {
        backendStatus: 'DECLINED_ADMIN',
        description: 'Отмена заявки на ввод админом',
        operationType: 'Deposit',
        status: 'Declined',
      },
      ACCEPTED_AUTO: {
        backendStatus: 'ACCEPTED_AUTO',
        description: 'Пополнение зачисленно автоматически',
        operationType: 'Deposit',
        status: 'Completed',
      },
      ACCEPTED_ADMIN: {
        backendStatus: 'ACCEPTED_ADMIN',
        description: 'Пополнение зачисленно админом',
        operationType: 'Deposit',
        status: 'Completed',
      },
      REVOKED_USER: {
        backendStatus: 'REVOKED_USER',
        description: 'Отмена заявки на ввод юзером',
        operationType: 'Deposit',
        status: 'Canceled',
      },
      EXPIRED: {
        backendStatus: 'EXPIRED',
        description: 'Просроченная заявка (бвла ранее создана, но не оплачена в течении 48 часов)',
        operationType: 'Deposit',
        status: 'Expired',
      },
    },
  };

  public getTrStatus(operationType: string, backendStatus: string) {
    return this.transactionsHistoryStatuses[operationType][backendStatus].status;
  }
  public getTrOperationType(operationType: string, backendStatus: string) {
    return this.transactionsHistoryStatuses[operationType][backendStatus].operationType;
  }
}
