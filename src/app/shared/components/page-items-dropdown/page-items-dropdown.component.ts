import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-page-items-dropdown',
  templateUrl: './page-items-dropdown.component.html',
  styleUrls: ['./page-items-dropdown.component.scss'],
})
export class PageItemsDropdownComponent implements OnInit {

  constructor() { }
  @ViewChild('dropdown') dropdownElement: ElementRef;
  @Input('countOfEntries') public countOfEntries: number;
  @Input('countPerPage') public countPerPage: number;
  @Input('pageCountsConfig') public pageCountsConfig: Array<number>;
  @Output() onChange = new EventEmitter<number>();

  public defaultPageCountsConfig = [15, 30, 45, 60];

  public toggleDropdown() {
    this.dropdownElement.nativeElement.classList.toggle('dropdown--open');
  }

  public onChangeItemsPerPage(e) {
    const element: HTMLElement = <HTMLElement>e.target;
    const items = parseInt(element.innerText, 10);
    this.onChange.emit(items);
  }

  ngOnInit() {
  }

}
