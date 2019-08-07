import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IEOItem } from 'app/model/ieo.model';
import { KycIEOModel } from 'app/ieo/models/ieo-kyc.model';

@Component({
  selector: 'app-ieo-header',
  templateUrl: './ieo-header.component.html',
  styleUrls: ['./ieo-header.component.scss'],
})
export class IeoHeaderComponent implements OnInit {
  @Input() public IEOData: IEOItem;
  @Input() public requirements: KycIEOModel;
  @Input() public userBalanceBTC: number;
  @Input() public currentStage: string;
  @Input() public isAuthenticated = false;
  @Input() public ieoLoading: boolean;
  @Output() public buy: EventEmitter<any> = new EventEmitter();
  @Output() public login: EventEmitter<any> = new EventEmitter();

  constructor() {}

  public stage = {
    PENDING: 'PENDING',
    RUNNING: 'RUNNING',
    TERMINATED: 'TERMINATED',
    SUCCEEDED: 'SUCCEEDED',
    FAILED: 'FAILED',
  };

  ngOnInit() {
    if (window.innerWidth > 992) {
      const startChangeHeader = 5;
      let currentPosition = window.pageYOffset;
      if (currentPosition > startChangeHeader) {
        document.querySelector('.page-wrap').classList.add('ieo-page-header');
      } else {
        document.querySelector('.page-wrap').classList.remove('ieo-page-header');
      }
      window.onscroll = function () {
        currentPosition = window.pageYOffset;
        if (currentPosition > startChangeHeader) {
          document.querySelector('.page-wrap').classList.add('ieo-page-header');
        } else {
          document.querySelector('.page-wrap').classList.remove('ieo-page-header');
        }
      };
    }
  }

  goToNewsPage() {
    const newWnd = window.open(`https://news.exrates.me/article/${this.IEOData.currencyName}`);
    newWnd.opener = null;
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

  get dashOffset() {
    return 127 - (127 * +this.boughtAmountPer) / 100;
  }
}
