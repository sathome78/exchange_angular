import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ico-table',
  templateUrl: './icotable.component.html',
  styleUrls: ['./icotable.component.scss']
})
export class ICOTableComponent implements OnInit {

  @Input('countPerPage') public countPerPage: number;
  @Input('loading') public loading: boolean;
  @Input('currentPage') public currentPage: number;
  @Input('countOfEntries') public countOfEntries: number;
  @Output('onPaginate') public onPaginate: EventEmitter<any> = new EventEmitter();
  public icoBalances = [];

  constructor() { }

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

}
