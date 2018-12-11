import {Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output, ViewChild, ElementRef} from '@angular/core';
import {BalanceItem} from '../../models/balance-item.model';

@Component({
  selector: 'app-balance-mob',
  templateUrl: './balance-mob.component.html',
  styleUrls: ['./balance-mob.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceMobComponent implements OnInit{

  constructor() { }
  @ViewChild('dropdown') dropdownElement: ElementRef;
  @ViewChild('scrollContainer') public scrollContainer: ElementRef;

  public screen = {
    MAIN: 'MAIN',
    DETAILS: 'DETAILS',
  }
  public currScreen: string = this.screen.MAIN;
  public showOnConfirmation: boolean = false;
  public showReserve: boolean = false;
  public loadModeDisabled: boolean = false;

  @Input('balances') public balances: BalanceItem[] = [];
  @Input('countPerPage') public countPerPage: number;
  @Input('currentPage') public currentPage: number;
  @Input('countOfEntries') public countOfEntries: number;
  @Input('Tab') public Tab;
  @Input('currTab') public currTab;
  @Input('hideAllZero') public hideAllZero;
  @Output('onToggleAllZero') public onToggleAllZero: EventEmitter<any> = new EventEmitter();
  @Output('onPaginate') public onPaginate: EventEmitter<any> = new EventEmitter();
  @Output('onSelectTab') public onSelectTab: EventEmitter<any> = new EventEmitter();
  @Output('openRefillBalancePopup') public openRefillBalancePopup: EventEmitter<any> = new EventEmitter();
  @Output('openSendMoneyPopup') public openSendMoneyPopup: EventEmitter<any> = new EventEmitter();
  // @Output('onPaginate') public onPaginate: EventEmitter<any> = new EventEmitter();

  public onLoadMore(): void {
    if(this.balances.length !== this.countOfEntries){
      this.onPaginate.emit({currentPage: +this.currentPage + 1, countPerPage: this.countPerPage}); 
    }
  }
  public onShowMobDetails(res: boolean): void {
    res ? this.currScreen = this.screen.DETAILS : this.currScreen = this.screen.MAIN;
    
  }
  public onTogglePanels(panel): void {
    switch(panel){
      case 'on_confirmation':
        this.showOnConfirmation = !this.showOnConfirmation;
        break;
      case 'reserve':
        this.showReserve = !this.showReserve;
        break;
    }
  }
  public onToggleDropdown(): void {
    this.dropdownElement.nativeElement.classList.toggle('dropdown--open');
  }

  ngOnInit() {
    // debugger
  }

}
