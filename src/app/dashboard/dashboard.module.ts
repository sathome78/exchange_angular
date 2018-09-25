import {NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard.component';
import { MarketsComponent } from './markets/markets.component';
import { TradingComponent } from './trading/trading.component';
import { BuyComponent } from './trading/buy/buy.component';
import { SellComponent } from './trading/sell/sell.component';
import { OrderBookComponent } from './order-book/order-book.component';
import { TradeHistoryComponent } from './trade-history/trade-history.component';
import { OrdersComponent } from './orders/orders.component';
import { OpenOrdersComponent } from './orders/open-orders/open-orders.component';
import { OrdersHistoryComponent } from './orders/orders-history/orders-history.component';
import { ChatComponent } from './chat/chat.component';
import { GraphComponent } from './graph/graph.component';
import { ActivePairComponent } from './active-pair/active-pair.component';

@NgModule({
  declarations: [
    ActivePairComponent,
    BuyComponent,
    ChatComponent,
    DashboardComponent,
    GraphComponent,
    MarketsComponent,
    OrderBookComponent,
    OrdersComponent,
    SellComponent,
    TradeHistoryComponent,
    TradingComponent,
    OpenOrdersComponent,
    OrdersHistoryComponent,
  ],
  imports: [

  ],
  exports: [

  ]
})
export class DashboardModule {

}
