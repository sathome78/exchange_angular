import {Component, OnInit, OnDestroy} from '@angular/core';
import {data} from './JSONData';
import {Store, select} from '@ngrx/store';
import {State} from 'app/core/reducers';
import {Subject} from 'rxjs';
import * as fromCore from '../core/reducers'
import {PopupService} from 'app/shared/services/popup.service';
import {takeUntil} from 'rxjs/operators';
import {IEOServiceService} from '../shared/services/ieoservice.service';
import {KycIEOModel} from './models/ieo-kyc.model';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-ieo',
  templateUrl: './ieo.component.html',
  styleUrls: ['./ieo.component.scss']
})
export class IEOComponent implements OnInit, OnDestroy {

  public ieoData = data;
  public isAuthenticated: boolean;
  public stage = {
    UPCOMING: 'UPCOMING',
    SALE: 'SALE',
    COMPLETED: 'COMPLETED',
  }
  public currentStage: string = this.stage.UPCOMING;
  public showNotification: boolean = false;
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  public requirements: KycIEOModel = new KycIEOModel(null, null, null);
  private IEOId: string;

  constructor(
    private store: Store<State>,
    private popupService: PopupService,
    private route: ActivatedRoute,
    private ieoService: IEOServiceService,
  ) {
    this.store
      .pipe(select(fromCore.getIsAuthenticated))
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((isAuth: boolean) => {
        this.isAuthenticated = isAuth;
        if(isAuth) {
          this.ieoService.checkKYC()
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe((res: KycIEOModel) => {
              if(res) {
                this.requirements = res;
              };
            })
        }
      })

    this.route.paramMap.subscribe(params => {
      this.IEOId = params.get("id")
      this.ieoService.getIEO(this.IEOId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        debugger;
      })
    })
  }

  ngOnInit() {

  }

  onLogin() {
    this.popupService.showMobileLoginPopup(true);
  }

  openNotification() {
    this.showNotification = true;
  }

  closeNotification() {
    this.showNotification = false;
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

}
