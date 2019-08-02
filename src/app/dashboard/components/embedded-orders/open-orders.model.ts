export class OpenOrders {
  constructor(
    public orderType: string,
    public baseType: string,
    public orderId: number,
    public currencyPairId: number,
    public amount: number,
    public rate: number,
    public commission: number,
    public total: number,
    public status: string
  ) {}
}
