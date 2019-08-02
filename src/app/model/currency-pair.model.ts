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
    public topMarket: boolean
  ) {}
}
