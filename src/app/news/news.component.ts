import {Component, OnInit} from '@angular/core';
import {PopupService} from '../shared/services/popup.service';
import {NgxXml2jsonService} from 'ngx-xml2json';
import {NewsService} from '../shared/services/news.service';
import * as moment from 'moment';
import {RssNews} from '../shared/models/rss-news.model';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  public allNews: RssNews[] = [];

  private parser;
  constructor(
    public popupService: PopupService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private newsService: NewsService
  ) {
    this.parser = new DOMParser();
  }

  ngOnInit() {
    const xml = this.parser.parseFromString(this.newsService.mockXml, 'text/xml');
    this.fetchAmbcrypto(this.ngxXml2jsonService.xmlToJson(xml))
    this.newsService.getRssNews().subscribe(res => console.log(res));
  }

  makeSubscription() {
      this.popupService.toggleNewsSubscribePopup(true);
  }


  fetchAmbcrypto(obj) {
    try {
      const arrItems = obj.rss.channel.item;
      arrItems.map(item => {
        const candidat: RssNews = {
          date: item.pubDate,
          title: item.title,
          redirectionUrl: item.link
        };
        this.allNews.push(candidat);
      });
      console.log(this.allNews);
    } catch (e) {}
  }

}
