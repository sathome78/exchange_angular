import { Component, OnInit } from '@angular/core';
import {PopupService} from '../../services/popup.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  constructor(private popupService: PopupService) { }

  ngOnInit() {
  }

  onOpenIdentityPopup(mode: string) {

    this.popupService.showIdentityPopup(mode);
  }

}
