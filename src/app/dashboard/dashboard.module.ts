import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import * as SockJS from 'sockjs-client';
import {DashboardComponent} from './dashboard.component';
import {MarketsComponent} from './components/markets/markets.component';
import {TradingComponent} from './components/trading/trading.component';
import {BuyComponent} from './components/trading/buy/buy.component';
import {SellComponent} from './components/trading/sell/sell.component';
import {OrderBookComponent} from './components/order-book/order-book.component';
import {TradeHistoryComponent} from './components/trade-history/trade-history.component';
import {OrdersComponent} from './components/orders/orders.component';
import {OpenOrdersComponent} from './components/orders/open-orders/open-orders.component';
import {OrdersHistoryComponent} from './components/orders/orders-history/orders-history.component';
import {ChatComponent} from './components/chat/chat.component';
import {GraphComponent} from './components/graph/graph.component';
import {SharedModule} from '../shared/shared.module';
import {GridsterModule} from 'angular2gridster';
import {DashboardService} from './dashboard.service';
import { CurrencySearchComponent } from './components/currency-pair-info/currency-search/currency-search.component';
import { MarketSearchComponent } from './components/market-search/market-search.component';
import { ToolsComponent } from './components/tools/tools.component';
import { CurrencyPairInfoComponent } from './components/currency-pair-info/currency-pair-info.component';
import {StompConfig, StompService} from '@stomp/ng2-stompjs';
import {environment} from '../../environments/environment';
import {DashboardWebSocketService} from './dashboard-websocket.service';
import {MarketService} from './components/markets/market.service';
import {OrderBookService} from './components/order-book/order-book.service';
import {TradeHistoryService} from './components/trade-history/trade-history.service';
import {ChatService} from './components/chat/chat.service';
import {ScrollbarModule} from 'ngx-scrollbar';
import {NgxPaginationModule} from 'ngx-pagination';
import {CurrencySortingPipe} from './components/markets/currency-sorting.pipe';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import { DayChatComponent } from './components/chat/day-chat/day-chat.component';
import { ChatMessageComponent } from './components/chat/chat-message/chat-message.component';
import {NicknamePipe} from './components/chat/chat-message/nickname.pipe';
import {PositivePipe} from './components/markets/positive.pipe';
import {ActivePairComponent} from './components/active-pair/active-pair.component';


export function socketProvider() {
  return new SockJS(environment.apiUrl + '/public_socket');
  // return new SockJS('http://localhost:5555/jsa-stomp-endpoint');
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  swipeEasing: true,
  wheelSpeed: 1
};

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
    ChatMessageComponent,
    CurrencySortingPipe,
    DashboardComponent,
    DayChatComponent,
    GraphComponent,
    MarketsComponent,
    NicknamePipe,
    OrderBookComponent,
    OrdersComponent,
    PositivePipe,
    SellComponent,
    TradeHistoryComponent,
    TradingComponent,
    OpenOrdersComponent,
    OrdersHistoryComponent,
    CurrencySearchComponent,
    MarketSearchComponent,
    ToolsComponent,
    CurrencyPairInfoComponent,
    DayChatComponent,
    ChatMessageComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridsterModule.forRoot(),
    ScrollbarModule,
    NgxPaginationModule,
    PerfectScrollbarModule
  ],
  exports: [

  ],
  providers: [
    ChatService,
    DashboardService,
    DashboardWebSocketService,
    MarketService,
    OrderBookService,
    StompService,
    TradeHistoryService,
    { provide: StompConfig, useValue: stompConfig },
    {provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG}
  ]
})
export class DashboardModule {

}
