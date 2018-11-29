
export class OrderItem {

  public id: number;
  public userId: number;
  public operationType: string;
  public operationTypeEnum: string;
  public stopRate: string;
  public exExchangeRate: number;
  public amountBase: number;
  public amountConvert: number;
  public comissionId: number;
  public commissionFixedAmount: number;
  public amountWithCommission: number;
  public userAcceptorId: number;
  public dateCreation: Date;
  public dateAcception: Date;
  public status: string;
  public dateStatusModification: Date;
  public commissionAmountForAcceptor: number;
  public amountWithCommissionForAcceptor: number;
  public currencyPairId: number;
  public currencyPairName: string;
  public statusString: string;
  public orderBaseType: string;
  public commissionValue: number;
}
