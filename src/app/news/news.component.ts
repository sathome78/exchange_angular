import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopupService} from '../shared/services/popup.service';
import {NewsService} from '../shared/services/news.service';
import * as moment from 'moment';
import {RssNews, RssNewsResponsse} from '../shared/models/rss-news.model';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit, OnDestroy {

  public allNews: RssNews[] = [];
  public currentPage = 0;
  public countPerPage = 20;
  public countNews = 0;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public newsScrollStyles: any = {};
  public isLoading = false;

  constructor(
    public popupService: PopupService,
    private newsService: NewsService
  ) {
    const componentHeight = window.innerHeight;
    this.newsScrollStyles = {'height': (componentHeight - 290) + 'px', 'overflow-y': 'scroll'};

  }

  ngOnInit() {
    this.getNewsFeed();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getNewsFeed(concat = false) {
    this.isLoading = true;
     const offset = this.countPerPage * this.currentPage;
     this.newsService
       .getRssNewsFeed(this.countPerPage, 0, offset)
       .pipe(takeUntil(this.ngUnsubscribe))
       .subscribe(res => {
         this.isLoading = false;
         this.countNews = (res as RssNewsResponsse).data.count;
        this.allNews = concat ? this.concatNews((res as RssNewsResponsse).data.feeds) : (res as RssNewsResponsse).data.feeds;
       }, error => {
         console.log(error);
       });
  }

  concatNews(arr: RssNews[]) {
    return this.allNews.concat(arr);
  }

  loadMoreNews() {
    this.currentPage += 1;
    this.getNewsFeed(true);
  }

}
