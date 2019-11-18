import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'app/shared/services/utils.service';
import { Store } from '@ngrx/store';
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
export class IEOTableMobComponent implements OnInit {
  @ViewChild('dropdown') dropdownElement: ElementRef;
  @ViewChild('scrollContainer') public scrollContainer: ElementRef;
  @Input() public leaveAnimationFn: boolean;
  public currencies = {
    BTC: 'BTC',
    USD: 'USD',
  };
  public startAnimation = false;
  public tableScrollStyles: any = {};
  public get currenciesArr() {
    return Object.keys(this.currencies);
  }

  public loadModeDisabled = false;
  public priceIn: string = this.currencies.USD;
  public hideAllZero = false;
  public currencyForChoose = '';
  public currValue = '';
  public isShowSearchPopup = false;
  public _IEOData;

  // @Input('IEOData') public IEOData: IEOItem[] = [];
  @Input('IEOData')
  set IEOData(data: IEOItem[]) {
    this._IEOData = data;
  }
  get IEOData() {
    return [
      ...(this._IEOData as IEOItem[]).sort((a, b) => {
        const aT = this.getDateValue(a.startDate);
        const bT = this.getDateValue(b.startDate);
        const diff = aT - bT;
        if (diff < 0) {
          return 1;
        }
        if (diff > 0) {
          return -1;
        }
        return 0;
      }),
    ];
  }
  @Input() public countOfPendingRequests = 0;
  @Input() public Tab;
  @Input() public currTab;
  @Output() public selectTab: EventEmitter<any> = new EventEmitter();
  @Output() public openRefillBalancePopup: EventEmitter<any> = new EventEmitter();
  @Output() public openSendMoneyPopup: EventEmitter<any> = new EventEmitter();
  @Output() public goToBalanceDetails: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    public utils: UtilsService,
    private store: Store<fromCore.State>,
    private cdr: ChangeDetectorRef
  ) {
    this.setScrollStyles();
  }

  setScrollStyles() {
    const componentHeight = window.innerHeight;
    this.tableScrollStyles = {
      height: componentHeight - 293 + 'px',
      'overflow-x': 'scroll',
    };
  }

  public onShowIEOMobDetails(item: IEOItem): void {
    this.goToBalanceDetails.emit({
      currencyId: item.id,
      priceIn: this.priceIn,
    });
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

  ngOnInit() {
    setTimeout(() => {
      this.startAnimation = true;
      console.log('afasdfs');
      this.cdr.detectChanges();
    }, 1000);
  }

  trackByFn(index, item) {
    return item.id;
  }
}
