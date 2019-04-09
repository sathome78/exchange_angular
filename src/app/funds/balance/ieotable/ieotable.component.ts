import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }
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

  public buyIeo(ieo) {

  }

}
