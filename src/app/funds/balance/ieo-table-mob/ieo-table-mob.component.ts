import { Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { BalanceItem } from '../../models/balance-item.model';
import { Router } from '@angular/router';
import { UtilsService } from 'app/shared/services/utils.service';
import * as fundsAction from '../../store/actions/funds.actions';
import { select, Store } from '@ngrx/store';
import * as fromCore from '../../../core/reducers';
import { IEOItem } from 'app/model/ieo.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-ieo-table-mob',
  templateUrl: './ieo-table-mob.component.html',
  styleUrls: ['./ieo-table-mob.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IEOTableMobComponent implements OnInit{

  @ViewChild('dropdown') dropdownElement: ElementRef;
  @ViewChild('scrollContainer') public scrollContainer: ElementRef;

  public currencies = {
    BTC: 'BTC',
    USD: 'USD',
  };

  public tableScrollStyles: any = {};
  public get currenciesArr() {
    return Object.keys(this.currencies);
  }

  public loadModeDisabled: boolean = false;
  public priceIn: string = this.currencies.USD;
  public hideAllZero: boolean = false;
  public currencyForChoose: string = '';
  public currValue: string = '';
  public isShowSearchPopup = false;

  @Input('IEOData') public IEOData: IEOItem[] = [];
  @Input('countOfPendingRequests') public countOfPendingRequests: number = 0;
  @Input('Tab') public Tab;
  @Input('currTab') public currTab;
  @Output('onSelectTab') public onSelectTab: EventEmitter<any> = new EventEmitter();
  @Output('openRefillBalancePopup') public openRefillBalancePopup: EventEmitter<any> = new EventEmitter();
  @Output('openSendMoneyPopup') public openSendMoneyPopup: EventEmitter<any> = new EventEmitter();
  @Output('onGoToBalanceDetails') public onGoToBalanceDetails: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private utils: UtilsService,
    private store: Store<fromCore.State>,
  ) {
    this.setScrollStyles();
  }

  setScrollStyles() {
    const componentHeight = window.innerHeight;
    this.tableScrollStyles = { height: (componentHeight - 293) + 'px', 'overflow-x': 'scroll' };
  }

  public onShowIEOMobDetails(item: IEOItem): void {
    this.onGoToBalanceDetails.emit({ currencyId: item.id, priceIn: this.priceIn });
  }

  public onToggleDropdown(): void {
    this.dropdownElement.nativeElement.classList.toggle('dropdown--open');
  }

  public onSelectCurrency(e): void {
    const element: HTMLElement = <HTMLElement>e.target;
    this.priceIn = this.currencies[element.innerText];
  }
  public onGoToPendingReq(): void {
    this.router.navigate(['/funds/pending-requests']);
  }

  public isFiat(currName: string): boolean {
    return this.utils.isFiat(currName);
  }

  public onChangeCurrPair(val: string): void {
    this.currValue = val;
  }

  get showContent(): boolean {
    return environment.showContent;
  }

  ngOnInit() {
  }

}
