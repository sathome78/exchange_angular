import { Component, OnInit } from '@angular/core';
import { PopupService } from 'app/shared/services/popup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restored-password-popup',
  templateUrl: './restored-password-popup.component.html',
  styleUrls: ['./restored-password-popup.component.scss'],
})
export class RestoredPasswordPopupComponent implements OnInit {

  constructor(
    private popupService: PopupService,
    private router: Router,
  ) { }

  ngOnInit() {
    // console.log('inited');
  }

  closeRecoveryPassPopup(): void {
    this.popupService.toggleRestoredPasswordPopup(false);
    this.router.navigate(['/']);
  }
  goToLogin(): void {
    this.popupService.toggleRestoredPasswordPopup(false);
    this.router.navigate(['/login']);
  }

}
