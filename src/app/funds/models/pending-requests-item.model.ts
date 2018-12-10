
export class PendingRequestsItem {

  constructor(
    public date: string,
    public currency: string,
    public amount: number,
    public commission: number,
    public system: string,
    public status: string,
  ) { }

  static statusMap = {
    'ON_PENDING': 'Awaits payment',
  }
  
}
