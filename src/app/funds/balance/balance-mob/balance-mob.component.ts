import {Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output} from '@angular/core';
import {BalanceItem} from '../../models/balance-item.model';

@Component({
  selector: 'app-balance-mob',
  templateUrl: './balance-mob.component.html',
  styleUrls: ['./balance-mob.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceMobComponent{

  constructor() {}

  public screen = {
    MAIN: 'MAIN',
    DETAILS: 'DETAILS',
  }
  public currScreen: string = this.screen.MAIN;
  public showOnConfirmation: boolean = false;
  public showReserve: boolean = false;

  @Input('balances') public balances: BalanceItem[] = [];
  @Input('countPerPage') public countPerPage: number;
  @Input('currentPage') public currentPage: number;
  @Input('countOfEntries') public countOfEntries: number;
  @Input('Tab') public Tab;
  @Input('currTab') public currTab;
  @Output('onPaginate') public onPaginate: EventEmitter<any> = new EventEmitter();
  @Output('onSelectTab') public onSelectTab: EventEmitter<any> = new EventEmitter();
  @Output('openRefillBalancePopup') public openRefillBalancePopup: EventEmitter<any> = new EventEmitter();
  @Output('openSendMoneyPopup') public openSendMoneyPopup: EventEmitter<any> = new EventEmitter();
  // @Output('onPaginate') public onPaginate: EventEmitter<any> = new EventEmitter();

  public changeItemsPerPage(items: number) {
    this.onPaginate.emit({currentPage: this.currentPage, countPerPage: items});
  }
  public changePage(page: number): void {
    this.onPaginate.emit({currentPage: page, countPerPage: this.countPerPage}); 
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

}
