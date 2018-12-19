// export class OrderItem {
//
//   constructor(public needRefresh: boolean,
//               public page: number,
//               public id: number,
//               public userId: number,
//               public orderType: string,
//               public exrate: number,
//               public amountBase: number,
//               public amountConvert: number,
//               public created: Date,
//               public accepted: Date,
//               public ordersIds: string) { }
//
//   static deepCopy(other: OrderItem) {
//     return new OrderItem( other.needRefresh,
//       other.page,
//       other.id,
//       other.userId,
//       other.orderType,
//       other.exrate,
//       other.amountBase,
//       other.amountConvert,
//       other.created,
//       other.accepted,
//       other.ordersIds);
//   }
// }

export class OrderItem {
  constructor(
    public amount: string,
    public currencyPairId: number,
    public exrate: string,
    public orderType: string,
    public sumAmount: string,
    public total: string,
    public id?: string,
  ) {}
}
