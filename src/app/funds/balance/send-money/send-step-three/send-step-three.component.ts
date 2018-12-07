import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-send-step-three',
  templateUrl: './send-step-three.component.html',
  styleUrls: ['./send-step-three.component.scss']
})
export class SendStepThreeComponent implements OnInit {

  @Input() choosedName: string;
  @Input() data;

  // public responseData;

  constructor() { }

  ngOnInit() {

  }

  onSendSuccess(data) {
    // this.choosedName = 'Send Success';
    // this.responseData = data;
  }

}
