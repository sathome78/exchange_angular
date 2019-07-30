
export class OrderItemOB {
  constructor(
    public amount: string,
    public currencyPairId: number,
    public exrate: string | number,
    public orderType: string,
    public sumAmount: string,
    public total: string,
    public id?: string,
  ) {}
}
