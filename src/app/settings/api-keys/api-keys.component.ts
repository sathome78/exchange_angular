import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiKeysService} from './api-keys.service';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import * as fromCore from '../../core/reducers';
import * as settingsActions from '../store/actions/settings.actions';

@Component({
  selector: 'app-api-keys',
  templateUrl: './api-keys.component.html',
  styleUrls: ['./api-keys.component.scss']
})
export class ApiKeysComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public showKeyCreatedPopup = false;
  apiKeys$: Observable<any[]>;
  public show2FAPopup = false;

  constructor(
    public apiKeysService: ApiKeysService,
    private store: Store<fromCore.State>,
  ) { }

  ngOnInit() {
    this.store.dispatch(new settingsActions.LoadApiKeysAction());
    this.apiKeys$ = this.store.pipe(select(fromCore.getApiKeys));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createApiKey() {
    this.apiKeysService.createApiKey('test')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        console.log(res);
      });
  }

  deleteApiKey(id: string) {
    this.apiKeysService.deleteApiKey(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.store.dispatch(new settingsActions.LoadApiKeysAction());
      });
  }

  public open2FAPopup() {
    this.show2FAPopup = true;
  }

  close2FAPopup() {
    this.show2FAPopup = false;
  }

  public toggleKeyCreatedPopup(flag: boolean) {
    this.showKeyCreatedPopup = flag;
  }
}
