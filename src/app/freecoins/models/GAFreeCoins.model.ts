export class GAFreeCoinsModel {
  constructor(
    public currencyName: string,
    public amount: number,
    public isOneTime: boolean,
    public period: number,
    public prize: number
  ) {}
}
