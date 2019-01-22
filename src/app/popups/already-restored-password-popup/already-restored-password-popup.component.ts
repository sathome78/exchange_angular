import { Component, OnInit } from '@angular/core';
import { PopupService } from 'app/shared/services/popup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-already-restored-password-popup',
  templateUrl: './already-restored-password-popup.component.html',
  styleUrls: ['./already-restored-password-popup.component.scss']
})
export class AlreadyRestoredPasswordPopupComponent implements OnInit {

  constructor(
    private popupService: PopupService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  closeRecoveryPassPopup(): void {
    this.popupService.toggleAlreadyRestoredPasswordPopup(false);
    this.router.navigate(['/']);
  }
  goToLogin(): void {
    this.popupService.toggleAlreadyRestoredPasswordPopup(false);
    this.router.navigate(['/']);
    this.popupService.showLoginPopup(true);
  }

}
