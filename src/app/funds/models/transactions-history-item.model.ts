export class TransactionHistoryItem {
  public datetime: string;
  public currencyName: string;
  public amount: number;
  public commissionAmount: number;
  public merchantName: string;
  public transactionsId: string;
  public status: string;
  public sourceType: string;
  public transactionHash: string;
  public confirmations: number;
  public neededConfirmations: number;
  public id: number;
}
