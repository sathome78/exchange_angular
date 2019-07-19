import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PopupService } from 'app/shared/services/popup.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, first } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-qubera-popups',
  templateUrl: './qubera-popups.component.html',
  styleUrls: ['./qubera-popups.component.scss']
})
export class QuberaPopupsComponent implements OnInit {
  
  public currentTemplate: TemplateRef<any>;
  constructor(
    private popupService: PopupService,
    private route: ActivatedRoute) { }

  currentPopup: string;

  ngOnInit() {
    this.getSubject();
  }

  getSubject() {
    this.popupService.getQuberaPopupListener()
    .pipe(first())
    .subscribe((popup: string) => {
      this.currentPopup = popup;
    });
  }

  closeMe() {
    this.popupService.closeQuberaPopup();
  }

}
