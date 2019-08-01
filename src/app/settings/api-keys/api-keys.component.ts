import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ApiKeysService} from './api-keys.service';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import * as fromCore from '../../core/reducers';
import * as settingsActions from '../store/actions/settings.actions';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {API_KEY_2FA_FOR} from '../../shared/constants';
import {ApiKeyItem, NewApiKeyItem} from '../../model/api-key.model';
import * as fundsReducer from '../../funds/store/reducers/funds.reducer';
import {BreakpointService} from '../../shared/services/breakpoint.service';

@Component({
  selector: 'app-api-keys',
  templateUrl: './api-keys.component.html',
  styleUrls: ['./api-keys.component.scss']
})
export class ApiKeysComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public showKeyCreatedPopup = false;
  public apiKeys: ApiKeyItem[] = [];
  public GAEnabled = false;
  public confirmDeleteKeyId: number;
  public keyIdForEnableTrading;
  public twoFAFor;
  public show2FAPopup = false;
  public form: FormGroup;
  public newKeyName: string;
  public newKey: NewApiKeyItem;
  public loading$: Observable<boolean>;
  public isSubmited = false;
  public heightMobScrollContainer;
  public charPattern = '[a-zA-Z]+';

  public countPerPage = 5;
  public currentPage = 1;

  constructor(
    public apiKeysService: ApiKeysService,
    private store: Store<fromCore.State>,
    public breakpointService: BreakpointService,
  ) { }

  ngOnInit() {
    this.calculateHeightScrollContainer();
    this.initForm();
    this.store.dispatch(new settingsActions.LoadApiKeysAction());

    this.store.pipe(select(fromCore.getApiKeys))
      .subscribe(res => {
        this.apiKeys = res as ApiKeyItem[];
      })

    this.loading$ = this.store.pipe(select(fromCore.getApiKeyLoading));
    this.store.pipe(select(fromCore.getGAStatus)).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.GAEnabled = res;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  calculateHeightScrollContainer() {
    const componentHeight = window.innerHeight;
    this.heightMobScrollContainer = componentHeight - 310;
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
    this.isSubmited = false;
  }

  confirmDelete(keyId) {
    this.confirmDeleteKeyId = keyId;
  }

  cleanConfirmDeleteKeyId() {
    this.confirmDeleteKeyId = null;
  }

  public toggleKeyCreatedPopup(flag: boolean) {
    this.showKeyCreatedPopup = flag;
    this.form.reset();
    this.isSubmited = false;
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
    this.isSubmited = true;
    if (this.form.valid) {
      this.sendPinToEmail();
      this.newKeyName = this.form.get('name').value;
      this.twoFAFor = API_KEY_2FA_FOR.NEW_KEY;
      this.open2FAPopup();
    }
  }

  sendPinToEmail() {
    if (!this.GAEnabled) {
      const tempSub = this.apiKeysService.sendPinToEmail().subscribe(res => {
        tempSub.unsubscribe();
      });
    }
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15),
        Validators.pattern(this.charPattern),
        this.existingName()
      ])
    });
  }

  setNewKey(key) {
    this.newKey = key;
    this.toggleKeyCreatedPopup(true);
  }

  changePage(event) {
    this.currentPage = event;
  }

  changeItemsPerPage(event) {
    this.currentPage = 1;
    this.countPerPage = event;
  }

  existingName(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const value = control.value;
      return !!this.apiKeys.filter(item => item.alias.toLowerCase() === value.toLowerCase()).length ? {'existKeyName': true} : null;
    };
  }

  trackByFn(index, item) {
    return item.id;
  }
}
