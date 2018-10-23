

export class OpenOrders {
  constructor(
    public orderId: number,
    public created: Date,
    public type: string,
    public averagePrice: string,
    public amount: string,
    public commission: string,
    public total: number,
    public status: string,
  ) {}
}
