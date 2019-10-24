export class SyndexPaymentSystem {
  public id: string;
  public name: string;
  public currency: SyndexPSCurrency[];
  public min_amount: { [key: string]: number };
}

export class SyndexPSCurrency {
  public id: string;
  public iso: string;
}
