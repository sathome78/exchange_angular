import { CurrencyChoose } from 'app/model/currency-choose.model';

export class TransferFormModel {
  operationType = 'USER_TRANSFER';
  currency = 0;
  sum: string | number = '';
  pin: string | number = '';
  currencyName = '';
  type: string;
  recipient?: string | null = null;

  constructor(
    type: string,
    currency: CurrencyChoose
  ) {
    this.type = this.setType(type);
    this.currency = currency.id;
    this.currencyName = currency.name;
    this.recipient = this.setRecipient(type);
  }

  private setType(inType) {
    switch (inType) {
      case 'SimpleTransfer':
        return 'TRANSFER';
      case 'VoucherTransfer':
        return 'INNER_VOUCHER';
      case 'VoucherFreeTransfer':
        return 'VOUCHER';
      default:
        return inType;
    }
  }

  private setRecipient(inType) {
    switch (inType) {
      case 'SimpleTransfer':
      case 'VoucherFreeTransfer':
        return '';
      case 'VoucherTransfer':
        return null;
      default:
        return null;
    }
  }
}
