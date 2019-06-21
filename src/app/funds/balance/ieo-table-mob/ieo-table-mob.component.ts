import {Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output, ViewChild, ElementRef} from '@angular/core';
import {BalanceItem} from '../../models/balance-item.model';
import {Router} from '@angular/router';
import {UtilsService} from 'app/shared/services/utils.service';
import * as fundsAction from '../../store/actions/funds.actions';
import {select, Store} from '@ngrx/store';
import * as fromCore from '../../../core/reducers';
import { IEOItem } from 'app/model/ieo.model';
import { environment } from 'environments/environment';
import * as moment from 'moment';

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
  }

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
  public _IEOData;

  // @Input('IEOData') public IEOData: IEOItem[] = [];
  @Input('IEOData')
  set IEOData(data: IEOItem[]) {
    this._IEOData = data;
  }
  get IEOData() {
    return [...(this._IEOData as IEOItem[]).sort((a, b) => {
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
    })];
  }
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
    this.tableScrollStyles = {'height': (componentHeight - 293) + 'px', 'overflow-x': 'scroll'};
  }


  public onShowIEOMobDetails(item: IEOItem): void {
    this.onGoToBalanceDetails.emit({currencyId: item.id, priceIn: this.priceIn});
  }

  public onToggleDropdown(): void {
    this.dropdownElement.nativeElement.classList.toggle('dropdown--open');
  }

  public onSelectCurrency(e): void {
    const element: HTMLElement = <HTMLElement>e.target;
    this.priceIn = this.currencies[element.innerText];
  }
  public onGoToPendingReq(): void {
    this.router.navigate(['/funds/pending-requests'])
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

  public getDateValue(d) {
    if (!d) {
      return 0;
    }
    if (typeof d === 'object') {
      return moment.utc({
        y: d.year,
        M: d.monthValue - 1,
        d: d.dayOfMonth,
        h: d.hour,
        m: d.minute,
        s: d.second,
      }).valueOf();
    }

    if (typeof d === 'string') {
      return moment.utc(d).valueOf();
    }
  }


  ngOnInit() {
  }

}
