export class UserBalance {
  constructor(
    public cur1: UserBalanceItem,
    public cur2: UserBalanceItem,
  ) {}
}

export class UserBalanceItem {
  name: string;
  balance: number;
};
