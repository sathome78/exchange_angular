export class CurrencyPair {
  public isFavorite = false;
  constructor(
    public needRefresh: boolean,
    public page: number,
    public currencyPairId: number,
    public currencyPairName: string,
    public lastOrderRate: number,
    public predLastOrderRate: number,
    public percentChange: number,
    public priceInUsd: number,
    public currencyVolume: number,
    public market: string,
    public volume: number,
    public lastOrderRate24hr: number,
    public high24hr: number,
    public low24hr: number,
    public topMarket: boolean
  ) {}
}
