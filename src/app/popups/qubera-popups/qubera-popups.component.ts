import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PopupService } from 'app/shared/services/popup.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-qubera-popups',
  templateUrl: './qubera-popups.component.html',
  styleUrls: ['./qubera-popups.component.scss']
})
export class QuberaPopupsComponent implements OnInit {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild('QuberaTY') public logInTemplate: TemplateRef<any>;
  
  public currentTemplate: TemplateRef<any>;
  constructor(
    private popupService: PopupService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.setTemplate('QuberaTY');
    this.route.url
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((segments) => {
        console.log(segments);
        setTimeout(() => {  // added to fix ExpressionChangedAfterItHasBeenCheckedError

            this.popupService.showSomePopupQubera(true);
        })
      });
  }

  setTemplate(template: string) {
    switch (template) {
      case 'QuberaTY':
        this.currentTemplate = this.logInTemplate;
        break;
    }
  }

  closeMe() {
    this.popupService.closeQuberaPopup();
  }

}
