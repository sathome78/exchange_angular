import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { IEOItem } from 'app/model/ieo.model';
import { KycIEOModel } from 'app/ieo/models/ieo-kyc.model';

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
      const date = new Date(d.year, d.monthValue - 1, d.dayOfMonth, d.hour, d.minute, d.second).toISOString();
      this.startTimer(date);
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  public startTimer(date: string): void {
    if(this.interval) {
      clearInterval(this.interval);
    }
    // TODO refactore
    let days, hours, minutes, seconds;
    const target_date = new Date(date).getTime();

    const pad = (n) => {
      return (n < 10 ? '0' : '') + n;
    }
    const getCountdown = () => {

      const current_date = new Date().getTime();
      let seconds_left = (target_date - current_date) / 1000;

      days = pad(parseInt((seconds_left / 86400) + ''));
      seconds_left = seconds_left % 86400;

      hours = pad(parseInt((seconds_left / 3600) + ''));
      seconds_left = seconds_left % 3600;

      minutes = pad(parseInt((seconds_left / 60) + ''));
      seconds = pad(parseInt((seconds_left % 60) + ''));
      if(target_date > current_date){
        this.timer = '<span>' + days + '</span><span>' + hours + '</span><span>' + minutes + '</span><span>' + seconds + '</span>';
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
    return `${d.year}-${d.monthValue < 10 ? '0' + d.monthValue: d.monthValue}-${d.dayOfMonth < 10 ? '0' + d.dayOfMonth: d.dayOfMonth} ` +
      `${d.hour < 10 ? '0' + d.hour: d.hour}:${d.minute < 10 ? '0' + d.minute: d.minute}:${d.second < 10 ? '0' + d.second: d.second}`
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
