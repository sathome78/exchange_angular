
export class CurrencyPair {

  public isSelected = false;

  constructor(public needRefresh: boolean,
              public page: number,
              public pairId: number,
              public currencyPairName: string,
              public lastOrderRate: number,
              public predLastOrderRate: number,
              public percentChange: number,
              public market: string,
              public description: string,
              public volume: number) { }

  static fromJSON(object: any) {
    const pair: CurrencyPair = new CurrencyPair(  object['needRefresh'],
                                                  object['page'],
                                                  object['pairId'],
                                                  object['currencyPairName'],
                                                  object['lastOrderRate'],
                                                  object['predLastOrderRate'],
                                                  object['percentChange'],
                                                  object['market'],
                                                  object['description'],
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
