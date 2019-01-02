export interface RefillData {
  operationType: string;
  currency: number;
  merchant: number;
  sum: number;
  forceGenerateNewAddress?: boolean;
}
