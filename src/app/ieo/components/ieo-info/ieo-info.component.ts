import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { IEOItem } from 'app/model/ieo.model';
import { KycIEOModel } from 'app/ieo/models/ieo-kyc.model';
import * as moment from 'moment';

@Component({
  selector: 'app-ieo-info',
  templateUrl: './ieo-info.component.html',
  styleUrls: ['./ieo-info.component.scss']
})
export class IEOInfoComponent implements OnInit, OnDestroy, OnChanges {

  public timer: string = '';
  public interval;
  public stage = {
    PENDING: 'PENDING',
    RUNNING: 'RUNNING',
    SUCCEEDED: 'SUCCEEDED',
    FAILED: 'FAILED',
  }

  @Input('isAuthenticated') public isAuthenticated: boolean = false;
  @Input('currentStage') public currentStage: string;
  @Input('IEOData') public IEOData: IEOItem;
  @Input('requirements') public requirements: KycIEOModel;
  @Input('ieoLoading') public ieoLoading: boolean;
  @Input('userBalanceBTC') public userBalanceBTC: number;
  @Output('onLogin') public onLogin: EventEmitter<any> = new EventEmitter();
  @Output('onRefreshIEOStatus') public onRefreshIEOStatus: EventEmitter<any> = new EventEmitter();
  @Output('onBuy') public onBuy: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(c) {
    if(c.IEOData && c.IEOData.currentValue) {
      const d = this.IEOData.startDate;
      if(!d) return;
      const date = moment.utc({
        y: d.year, M: d.monthValue - 1, d: d.dayOfMonth, h: d.hour, m: d.minute, s: d.second
      }).local();
      this.startTimer(date);
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  public startTimer(date: moment.Moment): void {
    if(this.interval) {
      clearInterval(this.interval);
    }

    const getCountdown = () => {
      const current_date: moment.Moment = moment();
      const diff: number = date.diff(current_date);

      if(diff > 0){
        this.timer =
          '<span>' + moment(diff).format('DD') + '</span>' +
          '<span>' + moment(diff).format('HH') + '</span>' +
          '<span>' + moment(diff).format('mm') + '</span>' +
          '<span>' + moment(diff).format('ss') + '</span>';
      }
      else{
        this.timer = '<span>' + '00' + '</span><span>' + '00' + '</span><span>' + '00' + '</span><span>' + '00' + '</span>';
        if( this.currentStage === this.stage.PENDING) {
          this.onRefreshIEOStatus.emit();
          if(this.interval) {
            clearInterval(this.interval);
          }
        }
      }

    }
    getCountdown();
    this.interval = setInterval(() => getCountdown(), 1000);
  }
  public login() {
    this.onLogin.emit();
  }

  public onBuyEvent() {
    this.onBuy.emit();
  }

  public getFormatDate(d) {
    if(!d) {
      return '0000-00-00 00:00:00'
    }
    return moment.utc({
      y: d.year,
      M: d.monthValue - 1,
      d: d.dayOfMonth,
      h: d.hour,
      m: d.minute,
      s: d.second,
    }).local().format('YYYY-MM-DD HH:mm:ss');
  }

  get boughtAmount () {
    return (this.IEOData.amount - this.IEOData.availableAmount) || 0;
  }

  get sessionSupply () {
    return (this.IEOData.amount * this.IEOData.rate) || 0;
  }

   get boughtAmountPer () {
    const a = (this.boughtAmount / (this.IEOData.amount / 100)) || 0
    return a.toFixed(2);
  }

  goToNewsPage() {
    window.open(`https://news.exrates.me/article/${this.IEOData.currencyName}`)
  }
}
