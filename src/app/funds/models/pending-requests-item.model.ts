export class PendingRequestsItem {
  constructor(
    public requestId: number,
    public date: string,
    public currency: string,
    public amount: number,
    public commission: number,
    public system: string,
    public status: string,
    public operation: string
  ) {}
}
