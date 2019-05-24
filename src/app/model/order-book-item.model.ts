import { OrderItem } from 'app/orders/models/order-item.model';

export class OrderBookItem {
  constructor(
    public lastExrate: string,
    public orderBookItems: OrderItem[],
    public orderType: 'BUY' | 'SELL',
    public positive: boolean,
    public preLastExrate: string,
    public total: string,
  ) {}
}
