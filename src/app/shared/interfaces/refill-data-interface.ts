export interface RefillData {
  operationType: string;
  currency: number;
  merchant: number;
  sum: number;
  destination?: string;
  merchantImage?: number;
  generateNewAddress?: boolean;
}

export interface RefillDataSyndex {
  operationType: string;
  currency: number;
  merchant: number;
  sum: number;
  destination?: string;
  merchantImage?: number;
  generateNewAddress?: boolean;
  country: string;
  currencyToPaySyndex: string;
  paymentSystem: string;
}
