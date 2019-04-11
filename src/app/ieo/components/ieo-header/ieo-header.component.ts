import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IEOItem } from 'app/model/ieo.model';
import { KycIEOModel } from 'app/ieo/models/ieo-kyc.model';

@Component({
  selector: 'app-ieo-header',
  templateUrl: './ieo-header.component.html',
  styleUrls: ['./ieo-header.component.scss']
})
export class IeoHeaderComponent implements OnInit {

  @Input() public IEOData: IEOItem;
  @Input() public requirements: KycIEOModel;
  @Input() public userBalanceBTC: number;
  @Input() public currentStage: string;
  @Input() public isAuthenticated: boolean = false;
  @Input() public ieoLoading: boolean;
  @Output() public onBuy: EventEmitter<any> = new EventEmitter();
  @Output() public onLogin: EventEmitter<any> = new EventEmitter();

  constructor() { }

  public stage = {
    PENDING: 'PENDING',
    RUNNING: 'RUNNING',
    SUCCEEDED: 'SUCCEEDED',
    FAILED: 'FAILED',
  }

  ngOnInit() {
    if(window.innerWidth > 992){
      setTimeout(function(){
        var startChangeHeader = 5;
        var currentPosition = window.pageYOffset;
        if(currentPosition > startChangeHeader){
          document.querySelector(".page-wrap").classList.add("ieo-page-header");
        }
        else{
          document.querySelector(".page-wrap").classList.remove("ieo-page-header");
        }
        window.onscroll = function(){
          currentPosition = window.pageYOffset;
          if(currentPosition > startChangeHeader){
            document.querySelector(".page-wrap").classList.add("ieo-page-header");
          }
          else{
            document.querySelector(".page-wrap").classList.remove("ieo-page-header");
          }
        }
      },300)
    }
  }

  goToNewsPage() {
    window.open(`https://news.exrates.me/article/${this.IEOData.currencyName}`)
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

  get dashOffset () {
    return 127 - (127 * +this.boughtAmountPer / 100)
  }

}
