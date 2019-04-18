import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ApiKeysService} from '../api-keys.service';

@Component({
  selector: 'app-api-key-popup',
  templateUrl: './api-key-popup.component.html',
  styleUrls: ['./api-key-popup.component.scss']
})
export class ApiKeyPopupComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public serverPinErrorForView = '';
  @Input() isPinFomGA: boolean;
  @Output() close2FAPopup = new EventEmitter<boolean>();

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

}
