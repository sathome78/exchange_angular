import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-kyc-step-two',
  templateUrl: './kyc-step-two.component.html',
  styleUrls: ['./kyc-step-two.component.scss']
})
export class KycStepTwoComponent implements OnInit {

  @Input() iframeUrl = 'https://shuftipro.com/process/verification/XecjIEnYDKXzc3t6QoRkW0sdIZNo7GpkiKAj3k650oq1iNGpTqTUatVCreRav6vB';
  constructor() { }

  ngOnInit() {
  }

}
