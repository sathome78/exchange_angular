import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { IEOItem } from 'app/model/ieo.model';
import { KycIEOModel } from 'app/ieo/models/ieo-kyc.model';
import * as moment from 'moment';

@Component({
  selector: 'app-ieo-info',
  templateUrl: './ieo-info.component.html',
  styleUrls: ['./ieo-info.component.scss'],
})
export class IEOInfoComponent implements OnInit, OnDestroy, OnChanges {
  public timer = '';
  public interval;
  public stage = {
    PENDING: 'PENDING',
    RUNNING: 'RUNNING',
    TERMINATED: 'TERMINATED',
    SUCCEEDED: 'SUCCEEDED',
    FAILED: 'FAILED',
  };

  @Input() public isAuthenticated = false;
  @Input() public currentStage: string;
  @Input() public IEOData: IEOItem;
  @Input() public requirements: KycIEOModel;
  @Input() public ieoLoading: boolean;
  @Input() public userBalanceBTC: number;
  @Output() public login: EventEmitter<any> = new EventEmitter();
  @Output() public refreshIEOStatus: EventEmitter<any> = new EventEmitter();
  @Output() public buy: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit() {
    setTimeout(() =>{
      document.querySelectorAll(".animate-item").forEach(function(item){
      if(item.getBoundingClientRect().top + pageYOffset + 100 < pageYOffset + document.documentElement.clientHeight){
          item.classList.add('active')
      }
  })
    },1000)
  }

  ngOnChanges(c) {
    if (c.IEOData && c.IEOData.currentValue) {
      const d = this.IEOData.startDate;
      if (!d) {
        return;
      }
      const date = this.getLocalDateValue(d);
      this.startTimer(date);
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  public startTimer(date: moment.Moment): void {
    if (this.interval) {
      clearInterval(this.interval);
    }

    const getCountdown = () => {
      const current_date: moment.Moment = moment();
      const diff: number = date.diff(current_date);

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor(((diff % 86400000) % 3600000) / 60000);
      const seconds = Math.floor((((diff % 86400000) % 3600000) % 60000) / 1000);

      if (diff > 0) {
        this.timer =
          // tslint:disable-next-line: prefer-template
          '<span>' +
          (days < 10 ? '0' + days : days) +
          '</span>' +
          '<span>' +
          (hours < 10 ? '0' + hours : hours) +
          '</span>' +
          '<span>' +
          (minutes < 10 ? '0' + minutes : minutes) +
          '</span>' +
          '<span>' +
          (seconds < 10 ? '0' + seconds : seconds) +
          '</span>';
      } else {
        this.timer = '<span>00</span><span>00</span><span>00</span><span>00</span>';
        if (this.currentStage === this.stage.PENDING) {
          this.refreshIEOStatus.emit();
          if (this.interval) {
            clearInterval(this.interval);
          }
        }
      }
    };
    getCountdown();
    this.interval = setInterval(() => getCountdown(), 1000);
  }
  public onLogin() {
    this.login.emit();
  }

  public onBuyEvent() {
    this.buy.emit();
  }

  public getLocalDateValue(d): moment.Moment {
    if (typeof d === 'object') {
      return moment
        .utc({
          y: d.year,
          M: d.monthValue - 1,
          d: d.dayOfMonth,
          h: d.hour,
          m: d.minute,
          s: d.second,
        })
        .local();
    }

    if (typeof d === 'string') {
      return moment.utc(d).local();
    }
  }

  get boughtAmount() {
    return this.IEOData.amount - this.IEOData.availableAmount || 0;
  }

  get sessionSupply() {
    return this.IEOData.amount * this.IEOData.rate || 0;
  }

  get boughtAmountPer() {
    const a = this.boughtAmount / (this.IEOData.amount / 100) || 0;
    return a.toFixed(2);
  }

  goToNewsPage() {
    const newWnd = window.open(`https://news.exrates.me/article/${this.IEOData.currencyName}`);
    newWnd.opener = null;
  }
}
