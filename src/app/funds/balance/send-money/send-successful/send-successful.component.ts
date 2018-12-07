import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-send-successful',
  templateUrl: './send-successful.component.html',
  styleUrls: ['./send-successful.component.scss']
})
export class SendSuccessfulComponent implements OnInit {

  @Input() data;
  @Input() choosedName: string;
  @Output() closeMe = new EventEmitter();
  public operationName;
  constructor() { }

  ngOnInit() {
    console.log(this.choosedName);
    console.log(this.data)
    this.operationName = this.data.operationName;
    console.log(this.operationName);
  }

  onClose() {
    this.closeMe.emit();
  }

}
