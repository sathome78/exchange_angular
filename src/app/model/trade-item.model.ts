export class TradeItem {
  constructor(
    public acceptionTime: string,
    public amountBase: string,
    public dateAcceptionTime: string,
    public needRefresh: boolean,
    public operationType: string,
    public orderId: number,
    public page: number,
    public rate: string
  ) {}

  static deepCopy(other: TradeItem): TradeItem {
    return new TradeItem(
      other.acceptionTime,
      other.amountBase,
      other.dateAcceptionTime,
      other.needRefresh,
      other.operationType,
      other.orderId,
      other.page,
      other.rate
    );
  }
}
