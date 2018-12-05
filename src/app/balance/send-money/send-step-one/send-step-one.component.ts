import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-send-step-one',
  templateUrl: './send-step-one.component.html',
  styleUrls: ['./send-step-one.component.scss']
})
export class SendStepOneComponent implements OnInit {

  @Output() chooseSend = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onChooseSend(name: string) {
    this.chooseSend.emit(name);
  }

}
