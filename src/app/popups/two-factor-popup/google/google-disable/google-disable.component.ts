import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleAuthenticatorService } from '../google-authenticator.service';
import { PopupService } from '../../../../shared/services/popup.service';
import { AuthService } from 'app/shared/services/auth.service';
import { Store } from '@ngrx/store';
import * as fromCore from '../../../../core/reducers';
import * as settingsActions from '../../../../settings/store/actions/settings.actions';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AUTH_MESSAGES } from '../../../../shared/constants';

@Component({
  selector: 'app-google-disable',
  templateUrl: './google-disable.component.html',
  styleUrls: ['./google-disable.component.scss'],
})
export class GoogleDisableComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  statusMessage = '';
  form: FormGroup;
  loading: boolean = false;

  constructor(private popupService: PopupService,
              private authService: AuthService,
              private store: Store<fromCore.State>,
              private googleService: GoogleAuthenticatorService) { }

  ngOnInit() {
    this.form = new FormGroup({
      password: new FormControl('', { validators: [Validators.required] }),
      pincode: new FormControl('', { validators: [Validators.required] }),
    });
    // this.sendMePincode();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // sendMePincode() {
  //   this.googleService.sendMePincode().subscribe(res => {
  //       // console.log(res);
  //     },
  //     error1 => {
  //       console.log(error1);
  //     });
  // }

  disableGoogleAuth() {
    if (this.form.valid) {
      const password = this.form.get('password').value;
      const pincode = this.form.get('pincode').value;
      this.loading = true;
      this.googleService.disableGoogleAuthentication(password, pincode)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          // console.log(res);
          this.store.dispatch(new settingsActions.LoadGAStatusAction());
          this.popupService.closeTFAPopup();
          this.loading = false;
        },
                   err => {
                     if (err.status === 400) {
                       this.statusMessage = AUTH_MESSAGES.INVALID_CREDENTIALS;
                     } else {
                       this.statusMessage = AUTH_MESSAGES.OTHER_HTTP_ERROR;
                     }
                     this.loading = false;
                   });
    }
  }

}
