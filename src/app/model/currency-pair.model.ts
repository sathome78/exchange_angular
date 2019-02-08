export class CurrencyPair {

  public isSelected = false;
  public isFavourite = false;

  constructor(public needRefresh: boolean,
              public page: number,
              public currencyPairId: number,
              public currencyPairName: string,
              public lastOrderRate: number,
              public predLastOrderRate: number,
              public percentChange: number,
              public priceInUsd: number,
              public currencyVolume: number,
              public market: string,
              public volume: number) { }

  static fromJSON(object: any) {
    const pair: CurrencyPair = new CurrencyPair(  object['needRefresh'],
                                                  object['page'],
                                                  object['currencyPairId'],
                                                  object['currencyPairName'],
                                                  object['lastOrderRate'],
                                                  object['predLastOrderRate'],
                                                  object['percentChange'],
                                                  object['priceInUsd'],
                                                  object['currencyVolume'],
                                                  object['market'],
                                                  object['volume']);
    return pair;
  }

  static deepCopy(pair: CurrencyPair) {
    const out: CurrencyPair = CurrencyPair.fromJSON(pair);
    out.isSelected = pair.isSelected;
    return out;
  }

  isChangePositive(): boolean {
    return this.lastOrderRate > this.predLastOrderRate;
  }

}
