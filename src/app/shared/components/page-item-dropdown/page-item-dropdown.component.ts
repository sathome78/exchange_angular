import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-page-item-dropdown',
  templateUrl: './page-item-dropdown.component.html',
  styleUrls: ['./page-item-dropdown.component.scss']
})
export class PageItemDropdownComponent implements OnInit {

  constructor() { }
  @ViewChild('dropdown') dropdownElement: ElementRef;
  @Input('countOfEntries') public countOfEntries: number;
  @Input('pageCountsConfig') public pageCountsConfig: Array<number>;
  @Output() onChange = new EventEmitter<number>();
  
  public defaultPageCountsConfig = [15,30,45,60];
  public countPerPage: number = 
    this.pageCountsConfig ? this.pageCountsConfig[0] : this.defaultPageCountsConfig[0];

  public toggleDropdown() {
    this.dropdownElement.nativeElement.classList.toggle('dropdown--open');
  }

  public onChangeItemsPerPage(e) {
    const element: HTMLElement = <HTMLElement>e.target;
    this.countPerPage = parseInt(element.innerText, 10);
    this.onChange.emit(this.countPerPage);
  }

  ngOnInit() {
  }

}
