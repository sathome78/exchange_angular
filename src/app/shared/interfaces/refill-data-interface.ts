export interface RefillData {
  operationType: string;
  currency: number;
  merchant: number;
  sum: number;
  generateNewAddress?: boolean;
  child_merchant?: string;
}
