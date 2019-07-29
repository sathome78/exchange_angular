import { OrderItemOB } from './order-item-orders-book.model';

export class OrderBookItem {
  constructor(
    public lastExrate: string,
    public orderBookItems: OrderItemOB[],
    public orderType: 'BUY' | 'SELL',
    public positive: boolean,
    public preLastExrate: string,
    public total: string,
  ) {}
}
