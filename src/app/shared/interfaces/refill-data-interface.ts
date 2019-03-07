export interface RefillData {
  operationType: string;
  currency: number;
  merchant: number;
  sum: number;
  destination?: string;
  merchantImage?: number;
  generateNewAddress?: boolean;
}
