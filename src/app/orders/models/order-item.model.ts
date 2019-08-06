export class OrderItem {
  public id: number;
  public userId: number;
  public operationType: string;
  public operationTypeEnum: string;
  public stopRate: string;
  public limitRate: string;
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

// amountBase: "0.015"
// amountConvert: "1.425"
// amountWithCommission: "1.425"
// amountWithCommissionForAcceptor: null
// - childOrderId: 0
// comissionId: 34
// commissionAmountForAcceptor: null
// commissionFixedAmount: "0"
// commissionValue: 0
// currencyPairId: 72
// currencyPairName: "EOS/BTC"
// dateAcception: null
// dateCreation: "2019-07-26 09:15:13"
// - dateModification: null
// dateStatusModification: null
// exExchangeRate: "95.00"
// id: 53639491
// limitRate: null
// - needRefresh: true
// operationType: "BUY LIMIT"
// operationTypeEnum: "BUY"
// orderBaseType: "LIMIT"
// - page: 0
// status: "OPENED"
// statusString: null
// stopRate: null
// userAcceptorId: 0
// userId: 102639
