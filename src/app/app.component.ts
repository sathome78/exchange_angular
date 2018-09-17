import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopupService} from './services/popup.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'exrates-front-new';

  isTfaPopupOpen = false;
  tfaSubscription: Subscription;
  identitySubscription: Subscription;
  isIdentityPopupOpen = false;


  constructor(private popupService: PopupService,
              private router: Router) {
    // this.popupService.getShowTFAPopupListener().subscribe(isOpen => this.isTfaPopupOpen);
  }

  ngOnInit(): void {
    this.subscribeForTfaEvent();
    this.subscribeForIdentityEvent();
  }

  subscribeForTfaEvent() {
    this.tfaSubscription = this.popupService
      .getTFAPopupListener()
      .subscribe(value => {
        this.isTfaPopupOpen = value ? true : false;
      });
  }

  subscribeForIdentityEvent() {
    this.identitySubscription = this.popupService
      .getIdentityPopupListener()
      .subscribe(value => {
        this.isIdentityPopupOpen = value ? true : false;
      });
  }

  ngOnDestroy(): void {
    this.tfaSubscription.unsubscribe();
    this.identitySubscription.unsubscribe();
  }
}
