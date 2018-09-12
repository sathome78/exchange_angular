import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopupService} from '../../services/popup.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-two-factor-popup',
  templateUrl: './two-factor-popup.component.html',
  styleUrls: ['./two-factor-popup.component.scss']
})
export class TwoFactorPopupComponent implements OnInit, OnDestroy {


  constructor(private popupService: PopupService) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

}
