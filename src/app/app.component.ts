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
  subscription: Subscription;


  constructor(private popupService: PopupService,
              private router: Router) {
    // this.popupService.getShowTFAPopupListener().subscribe(isOpen => this.isTfaPopupOpen);
  }

  ngOnInit(): void {
    this.subscription = this.popupService
      .getTFAPopupListener()
      .subscribe(value => {
        this.isTfaPopupOpen = value ? true : false;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
