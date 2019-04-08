import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-top-notification',
  templateUrl: './top-notification.component.html',
  styleUrls: ['./top-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopNotificationComponent implements OnInit {

  public active: boolean = true;
  @Input() public data;
  @ViewChild('component') public component: ElementRef;
  @Output() public close: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeMe() {
    this.active = false
  }

}
