export class RefillInnerTransferResponse {
  constructor(
    public userToNickName: string,
    public currencyId: number,
    public userFromId: number,
    public userToId: number,
    public commission: any,
    public notyAmount: string,
    public initialAmount: string,
    public comissionAmount: string
  ) {}
}
