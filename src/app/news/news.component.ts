import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopupService} from '../shared/services/popup.service';
import {AuthService} from '../shared/services/auth.service';
import {NewsService} from '../shared/services/news.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public popupService: PopupService,
    private authService: AuthService,
    private newsService: NewsService,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  makeSubscription() {
    if (this.authService.isAuthenticated()) {
      this.sendEmail();
    } else {
      this.popupService.toggleNewsSubscribePopup(true);
    }
  }

  sendEmail() {
      this.newsService.subscribeToPartnerNews(this.authService.getUsername())
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
           this.popupService.toggleNewsThankYouPopup(true);
        });
    }
}
