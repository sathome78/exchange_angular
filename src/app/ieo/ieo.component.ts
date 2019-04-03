import {Component, OnInit} from '@angular/core';
import {data} from './JSONData';
import {Store, select} from '@ngrx/store';
import {State} from 'app/core/reducers';
import {Observable} from 'rxjs';
import * as fromCore from '../core/reducers'
import {PopupService} from 'app/shared/services/popup.service';
@Component({
  selector: 'app-ieo',
  templateUrl: './ieo.component.html',
  styleUrls: ['./ieo.component.scss']
})
export class IEOComponent implements OnInit {

  public ieoData = data;
  public isAuthenticated$: Observable<boolean>;
  public stage = {
    UPCOMING: 'UPCOMING',
    SALE: 'SALE',
    COMPLETED: 'COMPLETED',
  }
  public currentStage: string = this.stage.UPCOMING;
  public showNotification: boolean = false;
  public showBuy: boolean = false;


  constructor(
    private store: Store<State>,
    private popupService: PopupService
  ) {
    this.isAuthenticated$ = store.pipe(select(fromCore.getIsAuthenticated));
  }

  ngOnInit() {
  }

  onLogin() {
    this.popupService.showMobileLoginPopup(true);
  }
  openNotification() {
    this.showNotification = true;
  }
  openBuy() {
    this.showBuy = true;
  }
  closeNotification() {
    this.showNotification = false;
  }
  closeBuy() {
    this.showBuy = false;
  }

}
