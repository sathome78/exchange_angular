import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopupService} from './services/popup.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'exrates-front-new';

  isTfaPopupOpen = false;


  constructor(private popupService: PopupService) {
    // this.popupService.getShowTFAPopupListener().subscribe(isOpen => this.isTfaPopupOpen);
  }

  ngOnInit(): void {
    this.popupService.getTFAPopupListener().subscribe(value => this.isTfaPopupOpen  = (value !== undefined));
  }

  ngOnDestroy(): void {
    this.popupService.getTFAPopupListener().unsubscribe();
  }
}
