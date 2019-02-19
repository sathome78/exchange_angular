import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import * as SockJS from 'sockjs-client';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {environment} from '../../environments/environment';
import {StompConfig, StompService} from '@stomp/ng2-stompjs';
import {ActivePairComponent} from './components/active-pair/active-pair.component';
import {ChatComponent} from './components/chat/chat.component';
import {ChatMessageComponent} from './components/chat/chat-message/chat-message.component';
import {CurrencyPairInfoComponent} from './components/currency-pair-info/currency-pair-info.component';
import {CurrencyPairInfoMobileComponent} from './components/currency-pair-info-mobile/currency-pair-info-mobile.component';
import {DashboardComponent} from './dashboard.component';
import {DayChatComponent} from './components/chat/day-chat/day-chat.component';
import {EmbeddedOrdersComponent} from './components/embedded-orders/embedded-orders.component';
import {EmbeddedOrdersHistoryComponent} from './components/embedded-orders/embedded-orders-history/embedded-orders-history.component';
import {EmbeddedOpenOrdersComponent} from './components/embedded-orders/embedded-open-orders/embedded-open-orders.component';
import {GraphComponent} from './components/graph/graph.component';
import {MarketsComponent} from './components/markets/markets.component';
import {OrderBookComponent} from './components/order-book/order-book.component';
import {TradeHistoryComponent} from './components/trade-history/trade-history.component';
import {TradingComponent} from './components/trading/trading.component';
import {ToolsComponent} from './components/tools/tools.component';
import {SharedModule} from '../shared/shared.module';
import {MarketSearchComponent} from './components/market-search/market-search.component';
import {GridsterModule} from 'angular2gridster';
import {ScrollbarModule} from 'ngx-scrollbar';
import {NgxPaginationModule} from 'ngx-pagination';
import {ChatService} from './components/chat/chat.service';
import {DashboardService} from './dashboard.service';
import {DashboardWebSocketService} from './dashboard-websocket.service';
import {MarketService} from './components/markets/market.service';
import {OrderBookService} from './services/order-book.service';
import {TradeHistoryService} from './components/trade-history/trade-history.service';
import {PositivePipe} from './components/markets/positive.pipe';
import {CurrencySortingPipe} from './components/markets/currency-sorting.pipe';
import {NicknamePipe} from './components/chat/chat-message/nickname.pipe';
import {EffectsModule} from '@ngrx/effects';
import {DashboardEffects} from './effects/dashboard.effects';
import {TranslateModule} from '@ngx-translate/core';
import {MomentModule} from 'angular2-moment';
import {MarketsItemComponent} from './components/markets/markets-item/markets-item.component';
import {CurrencyPairInfoService} from './services/currency-pair-info.service';
import {OrderBookMobileComponent} from './components/order-book-mobile/order-book-mobile.component';
import {TradingMobileComponent} from './components/trading-mobile/trading-mobile.component';
import {TradingService} from './services/trading.service';
import { CoreEffects } from 'app/core/effects/core.effects';
import {ShowWidgetPipe} from '../shared/pipes/show-widget.pipe';


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
    ChatComponent,
    ChatMessageComponent,
    CurrencyPairInfoComponent,
    CurrencyPairInfoMobileComponent,
    DashboardComponent,
    DayChatComponent,
    EmbeddedOrdersComponent,
    EmbeddedOrdersHistoryComponent,
    EmbeddedOpenOrdersComponent,
    GraphComponent,
    MarketsComponent,
    MarketSearchComponent,
    OrderBookComponent,
    OrderBookMobileComponent,
    TradeHistoryComponent,
    TradingComponent,
    TradingMobileComponent,
    ToolsComponent,

    // PIPES START
    CurrencySortingPipe,
    NicknamePipe,
    PositivePipe,
    ShowWidgetPipe,
    MarketsItemComponent,

    // PIPES END
  ],
  exports: [
    ActivePairComponent,
    ChatComponent,
    ChatMessageComponent,
    DashboardComponent,
    DayChatComponent,
    EmbeddedOrdersComponent,
    EmbeddedOrdersHistoryComponent,
    EmbeddedOpenOrdersComponent,
    GraphComponent,
    MarketsComponent,
    MarketSearchComponent,
    TradeHistoryComponent,
    TradingComponent,
    ToolsComponent,

    // PIPES START
    CurrencySortingPipe,
    NicknamePipe,
    PositivePipe,

    // PIPES END
  ],
  imports: [
    SharedModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    MomentModule,
    ReactiveFormsModule,
    GridsterModule.forRoot(),
    EffectsModule.forRoot([CoreEffects, DashboardEffects]),
    ScrollbarModule,
    NgxPaginationModule,
    PerfectScrollbarModule
  ],
  providers: [
    ChatService,
    DashboardService,
    DashboardWebSocketService,
    MarketService,
    OrderBookService,
    CurrencyPairInfoService,
    StompService,
    TradeHistoryService,
    TradingService,
    {provide: StompConfig, useValue: stompConfig},
    {provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG}
  ]
})
export class DashboardModule {

}
