import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ieo-info',
  templateUrl: './ieo-info.component.html',
  styleUrls: ['./ieo-info.component.scss']
})
export class IEOInfoComponent implements OnInit, OnDestroy {

  public timer: string = '';
  public showBuy: boolean = false;
  public interval;
  public stage = {
    UPCOMING: 'UPCOMING',
    SALE: 'SALE',
    COMPLETED: 'COMPLETED',
  }

  @Input('isAuthenticated') public isAuthenticated: boolean = false;
  @Input('currentStage') public currentStage: string;
  @Output('onLogin') public onLogin: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.startTimer('2019-04-05T19:00:00.000');
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
  public startTimer(date: string): void {
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
        this.timer = "<span>" + days + "</span><span>" + hours + "</span><span>" + minutes + "</span><span>" + seconds + "</span>";
      }
      else{
        this.timer = "<span>" + "00" + "</span><span>" + "00" + "</span><span>" + "00" + "</span><span>" + "00" + "</span>";
      }

    }
    getCountdown();
    this.interval = setInterval(() => getCountdown(), 1000);
  }
  public login() {
    this.onLogin.emit();
  }
  public openBuy() {
    this.showBuy = true;
  }
  public closeBuy() {
    this.showBuy = false;
  }
  public onBuy() {
    debugger
    this.openBuy();
  }
}
