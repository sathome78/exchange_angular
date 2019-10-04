import { Component, OnInit } from '@angular/core';
import { Subscription, Subject, of } from 'rxjs';
import { DashboardWebSocketService } from 'app/dashboard/dashboard-websocket.service';
import { takeUntil } from 'rxjs/operators';
import { State } from 'app/core/reducers/index';
import { Store } from '@ngrx/store';
import * as dashboardActions from 'app/dashboard/actions/dashboard.actions';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public slides = [];
  public slideConfig = {
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    dots: false,
  };

  public loading = false;
  private marketsSub$: Subscription;

  constructor(
    private dashboardWebsocketService: DashboardWebSocketService,
    private store: Store<State>
  ) {}

  ngOnInit() {
    this.subscribeMarkets();
  }

  subscribeMarkets(): void {
    this.unsubscribeMarkets();
    this.loadingStarted();
    this.marketsSub$ = this.dashboardWebsocketService
      .marketsSubscription()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.store.dispatch(new dashboardActions.SetMarketsCurrencyPairsAction(data));
        this.loadingFinished();
      });
  }

  unsubscribeMarkets() {
    if (this.marketsSub$) {
      this.marketsSub$.unsubscribe();
    }
  }

  private loadingFinished(): void {
    this.loading = false;
  }
  private loadingStarted(): void {
    this.loading = true;
  }

}
