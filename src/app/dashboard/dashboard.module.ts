import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import * as SockJS from 'sockjs-client';
import {DashboardComponent} from './dashboard.component';
import {MarketsComponent} from './markets/markets.component';
import {TradingComponent} from './trading/trading.component';
import {BuyComponent} from './trading/buy/buy.component';
import {SellComponent} from './trading/sell/sell.component';
import {OrderBookComponent} from './order-book/order-book.component';
import {TradeHistoryComponent} from './trade-history/trade-history.component';
import {OrdersComponent} from './orders/orders.component';
import {OpenOrdersComponent} from './orders/open-orders/open-orders.component';
import {OrdersHistoryComponent} from './orders/orders-history/orders-history.component';
import {ChatComponent} from './chat/chat.component';
import {GraphComponent} from './graph/graph.component';
import {ActivePairComponent} from './active-pair/active-pair.component';
import {SharedModule} from '../shared/shared.module';
import {GridsterModule} from 'angular2gridster';
import {DashboardDataService} from './dashboard-data.service';
import { CurrencySearchComponent } from './currency-pair-info/currency-search/currency-search.component';
import { MarketSearchComponent } from './market-search/market-search.component';
import { ToolsComponent } from './tools/tools.component';
import { CurrencyPairInfoComponent } from './currency-pair-info/currency-pair-info.component';
import {StompConfig, StompService} from '@stomp/ng2-stompjs';
import {environment} from '../../environments/environment';
import {DashboardWebSocketService} from './dashboard-websocket.service';
import {MarketService} from './markets/market.service';
import {OrderBookService} from './order-book/order-book.service';
import {TradeHistoryService} from './trade-history/trade-history.service';


export function socketProvider() {
  return new SockJS(environment.apiUrl + '/public_socket');
  // return new SockJS('http://localhost:5555/jsa-stomp-endpoint');
}

const stompConfig: StompConfig = {
  // Which server?
  url: socketProvider(),

  // Headers
  // Typical keys: login, passcode, host
  headers: {
    // login: 'guest',
    // passcode: 'guest'
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeat_in: 0, // Typical value 0 - disabled
  heartbeat_out: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 5000 (5 seconds)
  reconnect_delay: 5000,

  // Will log diagnostics on console
  debug: false
};

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
    CurrencySearchComponent,
    MarketSearchComponent,
    ToolsComponent,
    CurrencyPairInfoComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridsterModule.forRoot()
  ],
  exports: [

  ],
  providers: [
    DashboardDataService,
    DashboardWebSocketService,
    MarketService,
    OrderBookService,
    StompService,
    TradeHistoryService,
    { provide: StompConfig, useValue: stompConfig },
  ]
})
export class DashboardModule {

}
