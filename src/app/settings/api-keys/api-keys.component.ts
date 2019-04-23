import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiKeysService} from './api-keys.service';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import * as fromCore from '../../core/reducers';
import * as settingsActions from '../store/actions/settings.actions';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {API_KEY_2FA_FOR} from '../../shared/constants';
import {ApiKeyItem, NewApiKeyItem} from '../../model/api-key.model';

@Component({
  selector: 'app-api-keys',
  templateUrl: './api-keys.component.html',
  styleUrls: ['./api-keys.component.scss']
})
export class ApiKeysComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public showKeyCreatedPopup = false;
  public apiKeys$: Observable<ApiKeyItem[]>;
  public GAEnabled$: Observable<boolean>;
  public confirmDeleteKeyId: number;
  public keyIdForEnableTrading;
  public twoFAFor;
  public show2FAPopup = false;
  public form: FormGroup;
  public newKeyName: string;
  public newKey: NewApiKeyItem;

  constructor(
    public apiKeysService: ApiKeysService,
    private store: Store<fromCore.State>,
  ) { }

  ngOnInit() {
    this.initForm();
    this.store.dispatch(new settingsActions.LoadApiKeysAction());
    this.apiKeys$ = this.store.pipe(select(fromCore.getApiKeys));
    this.GAEnabled$ = this.store.pipe(select(fromCore.getGAStatus));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  deleteApiKey(id) {
    this.apiKeysService.deleteApiKey(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.store.dispatch(new settingsActions.LoadApiKeysAction());
        this.cleanConfirmDeleteKeyId();
      }, error => {
        this.cleanConfirmDeleteKeyId();
      });
  }

  public open2FAPopup() {
    this.show2FAPopup = true;
  }

  close2FAPopup() {
    this.show2FAPopup = false;
  }

  confirmDelete(keyId) {
    this.confirmDeleteKeyId = keyId;
  }

  cleanConfirmDeleteKeyId() {
    this.confirmDeleteKeyId = null;
  }

  public toggleKeyCreatedPopup(flag: boolean) {
    this.showKeyCreatedPopup = flag;
  }

  onChangeTrading(event, key: ApiKeyItem) {
    event.target.checked = key.allowTrade;
    const val = key.allowTrade;
    if (val) {
       this.apiKeysService
         .changeAllowTrade(key.id, false)
         .pipe(takeUntil(this.ngUnsubscribe))
         .subscribe(res => {
           this.store.dispatch(new settingsActions.LoadApiKeysAction());
       });
    } else {
      this.sendPinToEmail();
       this.keyIdForEnableTrading = key.id;
       this.twoFAFor = API_KEY_2FA_FOR.ENABLE_TRADING_FOR_KEY;
       this.open2FAPopup();
    }
  }

  createNewKey() {
    if (this.form.valid) {
      this.sendPinToEmail();
      this.newKeyName = this.form.get('name').value;
      this.twoFAFor = API_KEY_2FA_FOR.NEW_KEY;
      this.open2FAPopup();
    }
  }

  sendPinToEmail() {
    const tempSub = this.apiKeysService.sendPinToEmail().subscribe(res => {
      tempSub.unsubscribe();
    });
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });
  }
}
