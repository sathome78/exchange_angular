import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiKeysService } from '../api-keys.service';
import { API_KEY_2FA_FOR } from '../../../shared/constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewApiKeyItem } from '../../../model/api-key.model';
import { Store } from '@ngrx/store';
import * as fromCore from '../../../core/reducers';
import * as settingsActions from '../../store/actions/settings.actions';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-api-key-popup',
  templateUrl: './api-key-popup.component.html',
  styleUrls: ['./api-key-popup.component.scss'],
})
export class ApiKeyPopupComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public serverPinErrorForView = '';
  @Input() isPinFomGA: boolean;
  @Input() keyIdForEnableTrading;
  @Input() apiKeyName;
  @Input() twoFAFor;
  @Output() close2FAPopup = new EventEmitter<boolean>();
  @Output() createdNewKey = new EventEmitter<NewApiKeyItem>();
  public form: FormGroup;
  public validPin;

  public titlesPopup = [
    this.translateService.instant('Please enter two-factor authentication code that was sent to your email'),
    this.translateService.instant('Use Google Authenticator to generate pincode'),
  ];

  public serverPinError = [
    this.translateService.instant('Code is wrong!'),
    this.translateService.instant('Code is wrong! New code was sent to your email.'),
    this.translateService.instant('Code is wrong! Please, check you code in Google Authenticator application.'),
  ];

  constructor(
    public apiKeysService: ApiKeysService,
    private store: Store<fromCore.State>,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    if (this.form.valid) {
      this.validPin = this.form.get('pin').value;
      switch (this.twoFAFor) {
        case API_KEY_2FA_FOR.NEW_KEY:
          this.createApiKey();
          break;
        case API_KEY_2FA_FOR.ENABLE_TRADING_FOR_KEY:
          this.enableTradingForApiKeyId();
          break;
      }
    }

  }

  createApiKey() {
    this.apiKeysService.createApiKey(this.apiKeyName, this.validPin)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.createdNewKey.emit(res);
        this.close2FAPopup.emit(true);
      },         error => {
        if (error.status === 400) {
          this.serverPinErrorForView = this.isPinFomGA ? this.serverPinError[0] : this.serverPinError[1];
        }
      });
  }

  enableTradingForApiKeyId() {
    this.apiKeysService.changeAllowTrade(this.keyIdForEnableTrading, true, this.validPin)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.store.dispatch(new settingsActions.LoadApiKeysAction());
        this.close2FAPopup.emit(true);
      },         error => {
        if (error.status === 400) {
          this.serverPinErrorForView = this.isPinFomGA ? this.serverPinError[0] : this.serverPinError[1];
        }
      });
  }

  initForm() {
    this.form = new FormGroup({
      pin: new FormControl('', [Validators.required]),
    });
  }

}
