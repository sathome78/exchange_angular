import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-send-step-two',
  templateUrl: './send-step-two.component.html',
  styleUrls: ['./send-step-two.component.scss']
})
export class SendStepTwoComponent implements OnInit {

  @Input() choosedName: string;

  constructor() { }

  ngOnInit() {
  }

}
