import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {PopupService} from '../../../shared/services/popup.service';

@Component({
  selector: 'app-kyc-level1-step-two',
  templateUrl: './kyc-level1-step-two.component.html',
  styleUrls: ['./kyc-level1-step-two.component.scss']
})
export class KycLevel1StepTwoComponent implements OnInit {

  @Input() iframeUrl = '';
  @ViewChild('iframe') iframe: ElementRef;
  private appHost;
  constructor(
    private popupService: PopupService,
  ) { }

  ngOnInit() {
    this.appHost = window.location.host;
  }

  loadIframe() {
    if (this.iframe.nativeElement.contentWindow.location.host === this.appHost) {
      this.popupService.showKYCPopup(null);
    }
  }
}
