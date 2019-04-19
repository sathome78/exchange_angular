import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ApiKeysService} from '../api-keys.service';
import {API_KEY_2FA_FOR} from '../../../shared/constants';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-api-key-popup',
  templateUrl: './api-key-popup.component.html',
  styleUrls: ['./api-key-popup.component.scss']
})
export class ApiKeyPopupComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public serverPinErrorForView = '';
  @Input() isPinFomGA: boolean;
  @Input() keyIdForEnableTrading;
  @Input() apiKeyName;
  @Input() twoFAFor;
  @Output() close2FAPopup = new EventEmitter<boolean>();
  public form: FormGroup;
  public validPin;

  public titlesPopup = [
    'Please enter two-factor authentication code that was sent to your email',
    'Use Google Authenticator to generate pincode'
  ];

  public serverPinError = [
    'Code is wrong!',
    'Code is wrong! New code was sent to your email.',
    'Code is wrong! Please, check you code in Google Authenticator application.'
  ];

  constructor(
    public apiKeysService: ApiKeysService,
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
        console.log(res);
      });
  }

  enableTradingForApiKeyId() {
    this.apiKeysService.changeAllowTrade(this.keyIdForEnableTrading, true, this.validPin)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
      console.log(res);
    });
  }

  initForm() {
    this.form = new FormGroup({
      pin: new FormControl('', [Validators.required]),
    });
  }

}
