import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Notification } from 'app/model/notification.model';

@Component({
  selector: 'app-top-notification',
  templateUrl: './top-notification.component.html',
  styleUrls: ['./top-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopNotificationComponent implements OnInit {

  public active: boolean = true;
  @Input() public data: Notification;
  @ViewChild('component') public component: ElementRef;
  @Output() public close: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeMe() {
    this.close.emit(this.data.id);
  }

}
