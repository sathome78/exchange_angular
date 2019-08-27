import { QuberaBalanceItemModel } from './qubera-balance-item.model';

export class QuberaBalanceModel {
  constructor(
    public accountState: string,
    public availableBalance: QuberaBalanceItemModel,
    public currentBalance: QuberaBalanceItemModel
  ) {}
}
