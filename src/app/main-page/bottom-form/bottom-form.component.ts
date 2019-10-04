import { Component, OnInit } from '@angular/core';
import { PopupService } from 'app/shared/services/popup.service';

@Component({
  selector: 'app-bottom-form',
  templateUrl: './bottom-form.component.html',
  styleUrls: ['./bottom-form.component.scss'],
})
export class BottomFormComponent implements OnInit {
  public email: string;

  constructor(private popupService: PopupService) { }

  ngOnInit() {
  }

  openRegistration() {
    if (this.email) {
      this.popupService.showMobileRegistrationPopup(true, this.email);
    }
  }

}
