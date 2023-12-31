export class IEOItem {
  constructor( ) { }
  public id: number;
  public currencyName: string;
  public currencyDescription: string;
  public rate: number;
  public amount: number;
  public availableAmount: number;
  public contributors: number;
  public status: string;
  public minAmount: number;
  public personalAmount: number;
  public maxAmountPerClaim: number;
  public maxAmountPerUser: number;
  public startDate: any;
  public endDate: any;
  public version: number;
  public readyToIeo: boolean;
  public multiplyProcessing: boolean;
  public description: string;
  public logo: string;
}

// => PENDING, RUNNING, SUCCEEDED, FAILED
