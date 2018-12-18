export class BalanceCrypto {
  constructor(
    needRefresh: boolean,
    public page: number,
    public id: number,
    public userId: number,
    public currencyId: number,
    public currencyName: string,
    public currencyDescription: string,
    public activeBalance: string,
    public onConfirmation: string,
    public onConfirmationStage: string,
    public onConfirmationCount: string,
    public reservedBalance: string,
    public reservedByOrders: string,
    public reservedByMerchant: string,
  ) {
  }
}
