export class CurrencyPairInfo {
  constructor(
    public changedValue: number,
    public currencyRate: number,
    public lastCurrencyRate: number,
    public percentChange: number,
    public rateHigh: number,
    public rateLow: number,
    public volume24h: number,
  ) {}
}
