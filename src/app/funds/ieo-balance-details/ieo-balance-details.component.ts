import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromCore from '../../core/reducers';
import { Observable, Subject } from 'rxjs';
import * as fundsReducer from '../store/reducers/funds.reducer';
import * as fundsAction from '../store/actions/funds.actions';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';
import { IEOItem } from 'app/model/ieo.model';
import { IEOServiceService } from 'app/shared/services/ieoservice.service';
import * as moment from 'moment';

@Component({
  selector: 'app-ieo-balance-details',
  templateUrl: './ieo-balance-details.component.html',
  styleUrls: ['./ieo-balance-details.component.scss'],
})
export class IEOBalanceDetailsComponent implements OnInit, OnDestroy {
  public currencies = {
    BTC: 'BTC',
    USD: 'USD',
  };

  public stage = {
    PENDING: 'PENDING',
    RUNNING: 'RUNNING',
    TERMINATED: 'TERMINATED',
    SUCCEEDED: 'SUCCEEDED',
    FAILED: 'FAILED',
  };

  public selectedItem: any = {};
  public ieoBalances$: Observable<IEOItem[]>;
  public IEOData: IEOItem;
  public showBuyIEO = false;
  public showSuccessIEO = false;
  public userInfo: ParsedToken;
  public loadingBuy = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private store: Store<fromCore.State>,
    private route: ActivatedRoute,
    private location: Location,
    private ieoService: IEOServiceService,
    private router: Router
  ) {
    this.ieoBalances$ = this.store.pipe(select(fundsReducer.getIEOBalancesSelector));

    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      const currencyId = +params['id'];
      this.ieoBalances$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(balances => {
        if (balances && balances.length) {
          this.IEOData = balances.find(res => res.id == currencyId);
        }
      });
    });
    this.store
      .pipe(select(fromCore.getUserInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userInfo: ParsedToken) => {
        this.userInfo = userInfo;
        if (this.userInfo && this.userInfo.publicId) {
          this.getIEOTable(this.userInfo.publicId);
        } else {
          console.error('publicId = ', this.userInfo.publicId);
        }
      });
  }

  ngOnInit() {}

  public onGoBackToMain(): void {
    this.location.back();
  }

  public goToIeo(id) {
    this.router.navigate([`/ieo/${id}`]);
  }
  public goToIeoNews(name) {
    const newWnd = window.open(`https://news.exrates.me/article/${name}`, '_blank');
    newWnd.opener = null;
  }

  public getIEOTable(publicId) {
    this.ieoService
      .getListIEOTab(publicId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: IEOItem[]) => {
        this.store.dispatch(new fundsAction.SetIEOBalancesAction(res));
      });
  }

  public buyIeo(IEOData) {
    this.showBuyIEO = true;
  }

  public closeBuyIEO() {
    this.showBuyIEO = false;
  }
  public closeSuccessIEO() {
    this.showSuccessIEO = false;
  }

  public openSuccessIEO() {
    this.showSuccessIEO = true;
  }

  public confirmBuyIEO(amount) {
    this.loadingBuy = true;
    this.ieoService
      .buyTokens({
        currencyName: this.IEOData.currencyName,
        amount: amount + '',
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.closeBuyIEO();
        this.openSuccessIEO();
        this.loadingBuy = false;
      }, err => {
        this.loadingBuy = false;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
