export class TransferMerchant {
  public merchantId: number;
  public currencyId: number;
  public name: string;
  public processType: string;
  public minInputSum: number;
  public minOutputSum: number;
  public minTransferSum: number;
  public inputCommission: number;
  public outputCommission: number;
  public transferCommission: number;
  public minFixedCommission: number;
  public listMerchantImage: any;
  public withdrawBlocked: boolean;
  public refillBlocked: boolean;
  public transferBlocked: boolean;

}
