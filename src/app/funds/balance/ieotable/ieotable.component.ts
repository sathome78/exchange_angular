import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IEOItem } from 'app/model/ieo.model';
import { Subject } from 'rxjs';
import { IEOServiceService } from 'app/shared/services/ieoservice.service';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-ieo-table',
  templateUrl: './ieotable.component.html',
  styleUrls: ['./ieotable.component.scss'],
})
export class IEOTableComponent implements OnInit {
  @Input() public countPerPage: number;

  @Input('IEOData')
  set IEOData(data: IEOItem[]) {
    this._IEOData = data;
    this.handleTestIEO(data);
  }
  get IEOData() {
    return [
      ...(this._IEOData as IEOItem[]).sort((a, b) => {
        const aT = this.getDateValue(a.startDate);
        const bT = this.getDateValue(b.startDate);
        const diff = aT - bT;
        if (diff < 0) {
          return 1;
        } else if (diff > 0) {
          return -1;
        } else {
          return 0;
        }
      }),
    ];
  }

  @Input() public loading: boolean;
  @Input() public currentPage: number;
  @Input() public countOfEntries: number;
  @Output() public onPaginate: EventEmitter<any> = new EventEmitter();
  public icoBalances = [];
  public stage = {
    PENDING: 'PENDING',
    RUNNING: 'RUNNING',
    TERMINATED: 'TERMINATED',
    SUCCEEDED: 'SUCCEEDED',
    FAILED: 'FAILED',
  };
  public _IEOData;
  public selectedIEO: IEOItem;
  public showBuyIEO = false;
  public showWait = false;
  public showSorry = false;
  public showSuccessIEO = false;
  public _firstLoadedStatus;
  public loadingBuy = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private router: Router, private ieoService: IEOServiceService) {}

  ngOnInit() {}

  public handleTestIEO(data) {
    if (this.selectedIEO && data && data.length) {
      const ieo = data.find(i => i.id === this.selectedIEO.id);
      if (ieo && ieo.multiplyProcessing && ieo.status === this.stage.TERMINATED && this._firstLoadedStatus !== this.stage.TERMINATED) {
        this.toggleWait(false);
        this.toggleSorry(true);
      }
    }
  }

  public changeItemsPerPage(items: number) {
    this.onPaginate.emit({
      currentPage: this.currentPage,
      countPerPage: items,
    });
  }

  public changePage(page: number): void {
    this.onPaginate.emit({
      currentPage: page,
      countPerPage: this.countPerPage,
    });
  }

  public goToIeo(id) {
    this.router.navigate([`/ieo/${id}`]);
  }
  public goToIeoNews(name) {
    const newWnd = window.open(`https://news.exrates.me/article/${name}`, '_blank');
    newWnd.opener = null;
  }

  public closeBuyIEO() {
    this.showBuyIEO = false;
  }
  public closeSuccessIEO() {
    this.showSuccessIEO = false;
  }
  public buyIeo(IEOData) {
    this.selectedIEO = null;
    this.selectedIEO = IEOData;
    this.showBuyIEO = true;
  }
  public openSuccessIEO() {
    this.showSuccessIEO = true;
  }

  toggleWait(flag: boolean) {
    this.showWait = flag;
  }

  toggleSorry(flag: boolean) {
    this.showSorry = flag;
  }

  public confirmBuyIEO(amount) {
    this.loadingBuy = true;
    this.ieoService
      .buyTokens({
        currencyName: this.selectedIEO.currencyName,
        amount: amount + '',
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this._firstLoadedStatus = this.selectedIEO.status;
        this.closeBuyIEO();
        if (this.selectedIEO.multiplyProcessing && this.selectedIEO.status === this.stage.RUNNING) {
          this.toggleWait(true);
        } else {
          this.openSuccessIEO();
        }
        this.loadingBuy = false;
      }, err => {
        this.loadingBuy = false;
      });
  }

  public getDateValue(d) {
    if (!d) {
      return 0;
    }
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
        .valueOf();
    }

    if (typeof d === 'string') {
      return moment.utc(d).valueOf();
    }
  }

  trackByFn(index, item) {
    return item.id;
  }
}
