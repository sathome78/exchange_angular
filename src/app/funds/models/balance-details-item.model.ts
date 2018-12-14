import {BalanceConfirmationInfoItem} from "./balance-confirmation-info.model";

export class BalanceDetailsItem {
  public currencyId: number;
  public currencyName: string;
  public currencyDescription: string;
  public activeBalance: number;
  public onConfirmation: number;
  public onConfirmationStage: number;
  public onConfirmationCount: number;
  public reservedBalance: number;
  public reservedByOrders: number;
  public reservedByMerchant: number;
  public btcAmount: number;
  public usdAmount: number;
  public confirmations: BalanceConfirmationInfoItem[];
}
