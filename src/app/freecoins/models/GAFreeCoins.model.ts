export class GAFreeCoinsModel {
  constructor(
    public currencyName: string,
    public amount: number,
    public isOneTime: boolean,
    public period: number,
    public prize: number
  ) {}
}

export class GAFreeCoinsReqModel {
  constructor(
    public currency_name: string,
    public amount: number,
    public partial_amount: number,
    public single: boolean,
    public time_range: number,
    public pin: string
  ) {}
}
export class GAFreeCoinsPublicResModel {
  constructor(
    public id: number,
    public currency_name: string,
    public currency_description: string,
    public amount: number,
    public partial_amount: number,
    public total_quantity: number,
    public single: boolean,
    public time_range: number
  ) {}
}
export class GAFreeCoinsPrivateResModel {
  constructor(
    public id: number,
    public giveaway_id: number,
    public last_received: string,
    public received: boolean
  ) {}
}
