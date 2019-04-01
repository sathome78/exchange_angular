
export class DetailedCurrencyPair {
  currency1: SimpleCurrency;
  currency2: SimpleCurrency;
  hidden: boolean;
  id: number;
  market: string;
  marketName: string;
  name: string;
  pairType: string;
  permittedLink: boolean;
}

class SimpleCurrency {
  public id: number;
  public name: string;
  public hidden: boolean;
  public description: string;
}
