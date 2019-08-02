import { TradeItem } from './trade-item.model';

export class LastSellBuyOrder {
  constructor(public lastOrder: TradeItem, public lastSellOrder: TradeItem, public lastBuyOrder: TradeItem) {}
}
