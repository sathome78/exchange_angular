import { Component, OnInit, OnDestroy } from '@angular/core';
import * as coreAction from '../core/actions/core.actions';
import { Store, select } from '@ngrx/store';
import * as fromCore from 'app/core/reducers';
import { FreecoinsService } from './freecoins.service';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, withLatestFrom } from 'rxjs/operators';
import { GAFreeCoinsPublicResModel, GAFreeCoinsPrivateResModel } from './models/GAFreeCoins.model';
import { PopupService } from 'app/shared/services/popup.service';

@Component({
  selector: 'app-freecoins',
  templateUrl: './freecoins.component.html',
  styleUrls: ['./freecoins.component.scss'],
})
export class FreecoinsComponent implements OnInit, OnDestroy {
  public showFreeCoinsPopup = false;
  public showFreeCoinsCaptcha = false;

  public freecoinId: string | number;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public freecoinsList: GAFreeCoinsPublicResModel[] = [];
  public freecoinsState: { [id: string]: GAFreeCoinsPrivateResModel } = {};
  public freecoinsStateDefault = new GAFreeCoinsPrivateResModel(1, 1, '2000-01-01 00:00:01', false);
  public isAuthenticated: boolean;
  public userInfo: ParsedToken;

  constructor(
    private store: Store<fromCore.State>,
    private freeCoinsService: FreecoinsService,
    private popupService: PopupService
  ) {}

  ngOnInit() {
    this.store
      .pipe(select(fromCore.getIsAuthenticated))
      .pipe(withLatestFrom(this.store.pipe(select(fromCore.getUserInfo))))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([isAuth, userInfo]: [boolean, ParsedToken]) => {
        this.isAuthenticated = isAuth;
        this.userInfo = userInfo;
        this.refreshCoins();
        if (this.isAuthenticated) {
          this.store.dispatch(new coreAction.LoadCryptoCurrenciesForChoose());
        }
      });
  }

  refreshCoins() {
    if (this.isAuthenticated) {
      forkJoin(this.freeCoinsService.getFreeCoins(), this.freeCoinsService.getFreeCoinsPublic())
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.freecoinsState = result[0];
          this.freecoinsList = result[1];
        });
    } else {
      this.freeCoinsService
        .getFreeCoinsPublic()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((res: GAFreeCoinsPublicResModel[]) => {
          this.freecoinsList = res;
        });
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onToggleFreeCoinsPopup(value) {
    this.showFreeCoinsPopup = value;
  }

  onCheckCaptcha(id) {
    if (!this.isAuthenticated) {
      this.popupService.showMobileLoginPopup(true);
      return;
    }
    this.onToggleCaptcha(true);
    this.freecoinId = id;
  }

  recieveCoins() {
    if (this.freecoinId) {
      this.freeCoinsService
        .recieveCoins(this.freecoinId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((res: GAFreeCoinsPrivateResModel) => {
          this.freecoinsState = {
            ...this.freecoinsState,
            [res.giveaway_id]: res,
          };
        });
    }
  }

  onToggleCaptcha(value) {
    this.showFreeCoinsCaptcha = value;
  }

  onResolveCaptcha(e) {
    this.onToggleCaptcha(false);
    this.recieveCoins();
  }

  get isVipUser() {
    if (this.userInfo) {
      return this.userInfo.userRole === 'VIP_USER';
    }
    return false;
  }

  trackByFn(index, item) {
    return item.id;
  }
}
