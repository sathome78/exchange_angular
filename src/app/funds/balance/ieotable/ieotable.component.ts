import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {IEOItem} from 'app/model/ieo.model';
import {Subject} from 'rxjs';
import {IEOServiceService} from 'app/shared/services/ieoservice.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-ieo-table',
  templateUrl: './ieotable.component.html',
  styleUrls: ['./ieotable.component.scss']
})
export class IEOTableComponent implements OnInit {

  @Input('countPerPage') public countPerPage: number;
  @Input('IEOData') public IEOData: any;
  @Input('loading') public loading: boolean;
  @Input('currentPage') public currentPage: number;
  @Input('countOfEntries') public countOfEntries: number;
  @Output('onPaginate') public onPaginate: EventEmitter<any> = new EventEmitter();
  public icoBalances = [];
  public stage = {
    PENDING: 'PENDING',
    RUNNING: 'RUNNING',
    SUCCEEDED: 'SUCCEEDED',
    FAILED: 'FAILED',
  }

  public selectedIEO: IEOItem;
  public showBuyIEO: boolean = false;
  public showSuccessIEO: boolean = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private ieoService: IEOServiceService,
  ) { }

  ngOnInit() { }

  func() {

  }

  public changeItemsPerPage(items: number) {
    this.onPaginate.emit({currentPage: this.currentPage, countPerPage: items});
  }

  public changePage(page: number): void {
    this.onPaginate.emit({currentPage: page, countPerPage: this.countPerPage});
  }

  public getFormatDate(d) {
    return `${d.year}-${d.monthValue < 10 ? '0' + d.monthValue: d.monthValue}-${d.dayOfMonth < 10 ? '0' + d.dayOfMonth: d.dayOfMonth} ` +
      `${d.hour < 10 ? '0' + d.hour: d.hour}:${d.minute < 10 ? '0' + d.minute: d.minute}:${d.second < 10 ? '0' + d.second: d.second}`
  }

  public goToIeo(id) {
    this.router.navigate([`/ieo/${id}`])
  }
  public goToIeoNews(name) {
    window.open(`https://news.exrates.me/article/${name}`, '_blank');
  }

  public closeBuyIEO() {
    this.showBuyIEO = false;
    this.selectedIEO = null;
  }
  public closeSuccessIEO() {
    this.showSuccessIEO = false;
  }
  public buyIeo(IEOData) {
    this.selectedIEO = null;
    this.showBuyIEO = true;
    this.selectedIEO = IEOData;
  }
  public openSuccessIEO() {
    this.showSuccessIEO = true;

  }

  public confirmBuyIEO(amount) {
    this.ieoService.buyTokens({
      currencyName: this.selectedIEO.currencyName,
      amount: amount + '',
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.closeBuyIEO();
        this.openSuccessIEO();
      })
  }

}
