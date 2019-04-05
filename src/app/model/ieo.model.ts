export class IEOItem {
  constructor(
    public id: number,
    public currencyName: string,
    public currencyDescription: string,
    public rate: number,
    public amount: number,
    public availableAmount: number,
    public contributors: number,
    public status: string,
    public minAmount: number,
    public maxAmountPerClaim: number,
    public startDate: any,
    public endDate: any,
    public version: number,
  ) {
  }
}

// => PENDING, RUNNING, SUCCEEDED, FAILED
