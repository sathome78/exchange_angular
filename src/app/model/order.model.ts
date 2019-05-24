export class Order {

  constructor(public orderType: string,
              public orderId: number,
              public currencyPairId: number,
              public amount: number,
              public rate: number,
              public commission: number,
              public baseType: string,
              public total: number,
              public status: string,
              public stop?: number,
  ) { }

  static deepCopy(other: Order): Order {
    return new Order(other.orderType,
                     other.orderId,
                     other.currencyPairId,
                     other.amount,
                     other.rate,
                     other.commission,
                     other.baseType,
                     other.total,
                     other.status,
                     other.stop);
  }
}
