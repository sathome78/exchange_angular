import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-kyc-level1-step-two',
  templateUrl: './kyc-level1-step-two.component.html',
  styleUrls: ['./kyc-level1-step-two.component.scss']
})
export class KycLevel1StepTwoComponent implements OnInit {

  @Input() iframeUrl = '';
  constructor() { }

  ngOnInit() {
  }
}
