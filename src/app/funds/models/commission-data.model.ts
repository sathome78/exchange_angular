export class CommissionData {
  constructor(
    public addition: string,
    public amount: string,
    public companyCommissionAmount: string,
    public companyCommissionRate: string,
    public merchantCommissionAmount: string,
    public merchantCommissionRate: string,
    public resultAmount: string,
    public totalCommissionAmount: string,
    public commission_rates_sum: string,
  ) {}

}
